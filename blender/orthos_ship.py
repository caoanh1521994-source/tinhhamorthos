# Tinh hạm Orthos – dựng tàu 3D bằng Blender rồi xuất models/orthos.glb
#
# Cách chạy:
#   - Trong Blender: tab Scripting → Open → chọn file này → Run Script
#     (tàu hiện ra trong cảnh, file .glb được xuất ra thư mục models/ cạnh thư mục blender/)
#   - Hoặc dòng lệnh: blender -b -P blender/orthos_ship.py
#
# Quy ước để game đọc được (ship3d.js):
#   - Toạ độ ghi trong file này theo hệ của game (three.js): x = dọc thân (mũi ở +x),
#     y = hướng lên, z = sang ngang. Hàm C() đổi sang hệ Blender (z hướng lên).
#   - Mỗi khoang là một Empty tên Z_<mã> (train, ch1..ch5, lab, tk), mọi bộ phận của
#     khoang là con của Empty đó. Thân chính (không bấm được) nằm dưới Empty HULL.
#   - Tên vật liệu quyết định cách game tô: hull, plate, light, dark, glass, stripe, win,
#     acc (màu khoang, đổi theo trạng thái mở/hỏng/sửa xong), holo (chùm sáng hologram).
#   - Custom property (xuất thành extras): zone, spin_ax + spin_v (bộ phận quay),
#     anchor (điểm neo nhãn), flame_r (vị trí lửa động cơ), holo (chỗ đặt bản vẽ hologram).
#   Sửa hình trong Blender thoải mái, chỉ cần giữ đúng tên và các property này.

import bpy, bmesh, math, os
from mathutils import Vector, Matrix, Euler

PI = math.pi
HERE = os.path.dirname(os.path.abspath(__file__)) if '__file__' in globals() and __file__ else os.getcwd()
OUT = os.path.join(HERE, '..', 'models', 'orthos.glb')

# ---------------------------------------------------------------- cảnh trống
for o in list(bpy.data.objects):
    bpy.data.objects.remove(o, do_unlink=True)
for m in list(bpy.data.meshes):
    bpy.data.meshes.remove(m)
for m in list(bpy.data.materials):
    bpy.data.materials.remove(m)
col = bpy.data.collections.get('Orthos') or bpy.data.collections.new('Orthos')
if col.name not in bpy.context.scene.collection.children:
    bpy.context.scene.collection.children.link(col)

# three (x, y, z) -> blender (x, -z, y)
C4 = Matrix(((1, 0, 0, 0), (0, 0, -1, 0), (0, 1, 0, 0), (0, 0, 0, 1)))
def C(x, y, z):
    return Vector((x, -z, y))

# ---------------------------------------------------------------- vật liệu
def lin(h):
    c = [((h >> s) & 255) / 255 for s in (16, 8, 0)]
    return [v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4 for v in c] + [1]

MATS = {}
def mat(name, hexcol, metal=0.0, rough=0.5, emit=0.0, alpha=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes.get('Principled BSDF')
    b.inputs['Base Color'].default_value = lin(hexcol)
    b.inputs['Metallic'].default_value = metal
    b.inputs['Roughness'].default_value = rough
    if emit:
        b.inputs['Emission Color'].default_value = lin(hexcol)
        b.inputs['Emission Strength'].default_value = emit
    if alpha < 1:
        b.inputs['Alpha'].default_value = alpha
        try: m.surface_render_method = 'BLENDED'
        except Exception: pass
    MATS[name] = m
    return m

mat('hull', 0x2b3244, 0.85, 0.30)
mat('plate', 0x4b5672, 0.80, 0.36)
mat('light', 0xaeb9d2, 0.75, 0.28)
mat('dark', 0x0f121a, 0.60, 0.55)
mat('glass', 0x0b1830, 1.00, 0.04, emit=0.6)
mat('stripe', 0x39e6ff, 0, 0.5, emit=4)
mat('win', 0xffe2a8, 0, 0.5, emit=3)
mat('acc', 0x6fe3f5, 0, 0.5, emit=4)
mat('holo', 0x6fe3f5, 0, 0.5, emit=2, alpha=0.15)

# ---------------------------------------------------------------- công cụ dựng lưới (trong hệ three)
class Part:
    """Một vật = một bmesh nhiều vật liệu; toạ độ ghi theo hệ three."""
    def __init__(self, name):
        self.name, self.bm, self.mats = name, bmesh.new(), []
        self.bevel = None
    def mi(self, m):
        if m not in self.mats: self.mats.append(m)
        return self.mats.index(m)
    def _tag(self, verts, m):
        i = self.mi(m)
        fs = {f for v in verts for f in v.link_faces}
        for f in fs: f.material_index = i
        return fs

    # khối hộp: tâm p, kích thước s, góc quay r (độ ra radian)
    def box(self, p, s, m, r=(0, 0, 0)):
        M = Matrix.Translation(p) @ Euler(r, 'XYZ').to_matrix().to_4x4() @ Matrix.Diagonal((s[0], s[1], s[2], 1))
        v = bmesh.ops.create_cube(self.bm, size=1, matrix=M)['verts']
        return self._tag(v, m)

    # trụ / nón theo trục ax ('x','y','z'): r1 ở đầu âm, r2 ở đầu dương
    def cyl(self, p, r1, r2, L, m, ax='x', seg=16, cap=True, rot=None):
        R = {'x': Euler((0, PI / 2, 0)), 'y': Euler((-PI / 2, 0, 0)), 'z': Euler((0, 0, 0))}[ax].to_matrix().to_4x4()
        M = Matrix.Translation(p) @ (rot.to_matrix().to_4x4() if rot else Matrix()) @ R
        v = bmesh.ops.create_cone(self.bm, cap_ends=cap, segments=seg, radius1=r1, radius2=r2, depth=L, matrix=M)['verts']
        return self._tag(v, m)

    def sphere(self, p, r, m, u=16, v=10, s=(1, 1, 1)):
        M = Matrix.Translation(p) @ Matrix.Diagonal((s[0], s[1], s[2], 1))
        vv = bmesh.ops.create_uvsphere(self.bm, u_segments=u, v_segments=v, radius=r, matrix=M)['verts']
        return self._tag(vv, m)

    # xuyến: tâm p, bán kính R, ống r, trục ax
    def torus(self, p, R, r, m, ax='x', seg=40, tseg=8, arc=2 * PI):
        bm, i = self.bm, self.mi(m)
        rot = {'x': Euler((0, PI / 2, 0)), 'y': Euler((PI / 2, 0, 0)), 'z': Euler((0, 0, 0))}[ax].to_matrix()
        closed = arc >= 2 * PI - 1e-6
        n = seg if closed else seg + 1
        rings = []
        for a in range(n):
            t = arc * a / seg
            ring = []
            for b in range(tseg):
                u = 2 * PI * b / tseg
                q = Vector(((R + r * math.cos(u)) * math.cos(t), (R + r * math.cos(u)) * math.sin(t), r * math.sin(u)))
                ring.append(bm.verts.new(Vector(p) + rot @ q))
            rings.append(ring)
        for a in range(seg if closed else seg):
            A, B = rings[a], rings[(a + 1) % n]
            for b in range(tseg):
                f = bm.faces.new((A[b], B[b], B[(b + 1) % tseg], A[(b + 1) % tseg]))
                f.material_index = i

    # thân dạng nối các mặt cắt: S = [(x, w, h, y0)], prof(w,h) -> [(z, y)]
    def loft(self, S, m, prof, caps=True, inset=None):
        bm, i = self.bm, self.mi(m)
        rings = [[bm.verts.new((x, y + y0, z)) for z, y in prof(w, h)] for x, w, h, y0 in S]
        n, fs = len(rings[0]), []
        for a in range(len(rings) - 1):
            for b in range(n):
                f = bm.faces.new((rings[a][b], rings[a][(b + 1) % n], rings[a + 1][(b + 1) % n], rings[a + 1][b]))
                f.material_index = i; fs.append(f)
        if caps:
            for r in (rings[0], rings[-1]):
                f = bm.faces.new(r); f.material_index = i
        if inset:  # tạo đường ghép tấm giáp: lõm từng ô
            bmesh.ops.inset_individual(bm, faces=fs, thickness=inset[0], depth=inset[1])
        return fs

    # đa giác phẳng trong mặt (x, z) rồi đùn dày theo y
    def slab(self, pts, y, th, m):
        bm, i = self.bm, self.mi(m)
        vs = [bm.verts.new((x, y - th / 2, z)) for x, z in pts]
        f = bm.faces.new(vs); f.material_index = i
        r = bmesh.ops.extrude_face_region(bm, geom=[f])
        nv = [e for e in r['geom'] if isinstance(e, bmesh.types.BMVert)]
        bmesh.ops.translate(bm, vec=(0, th, 0), verts=nv)

    # thanh nối hai điểm (toạ độ đầy đủ)
    def bar(self, a, b, th, m, th2=None):
        a, b = Vector(a), Vector(b)
        d = b - a
        L = d.length
        q = d.to_track_quat('X', 'Y')
        M = Matrix.Translation((a + b) / 2) @ q.to_matrix().to_4x4() @ Matrix.Diagonal((L, th, th2 or th, 1))
        v = bmesh.ops.create_cube(self.bm, size=1, matrix=M)['verts']
        return self._tag(v, m)

    def mirror_z(self):
        """Nhân đôi phần đã dựng sang phía z âm (tàu đối xứng trái/phải)."""
        g = bmesh.ops.duplicate(self.bm, geom=self.bm.verts[:] + self.bm.edges[:] + self.bm.faces[:])['geom']
        nv = [e for e in g if isinstance(e, bmesh.types.BMVert)]
        bmesh.ops.scale(self.bm, vec=(1, 1, -1), verts=nv)
        nf = [e for e in g if isinstance(e, bmesh.types.BMFace)]
        bmesh.ops.reverse_faces(self.bm, faces=nf)

    def finish(self, parent, origin=(0, 0, 0), bevel=0.0, smooth=0.55):
        bm = self.bm
        if origin != (0, 0, 0):
            bmesh.ops.translate(bm, vec=-Vector(origin), verts=bm.verts)
        bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
        bmesh.ops.transform(bm, matrix=C4, verts=bm.verts)
        bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        me = bpy.data.meshes.new(self.name)
        bm.to_mesh(me); bm.free()
        for m in self.mats: me.materials.append(MATS[m])
        me.shade_smooth()
        me.set_sharp_from_angle(angle=smooth)
        ob = bpy.data.objects.new(self.name, me)
        col.objects.link(ob)
        ob.parent = parent
        if origin != (0, 0, 0):
            ob.location = C(*origin) - (parent.matrix_world.translation if parent else Vector())
        if bevel:
            md = ob.modifiers.new('Bevel', 'BEVEL')
            md.width, md.segments, md.limit_method, md.angle_limit = bevel, 1, 'ANGLE', math.radians(35)
            md.harden_normals = False
        return ob

def empty(name, p=(0, 0, 0), parent=None, **props):
    e = bpy.data.objects.new(name, None)
    e.empty_display_size = 0.25
    col.objects.link(e)
    e.parent = parent
    e.location = C(*p) - (parent.matrix_world.translation if parent else Vector())
    for k, v in props.items(): e[k] = v
    bpy.context.view_layer.update()
    return e

# mặt cắt thân: 16 cạnh, vát tròn hơn bản cũ (bát giác)
def hullprof(w, h):
    half = [(0, h), (.38 * w, .97 * h), (.72 * w, .8 * h), (.94 * w, .46 * h), (w, .1 * h),
            (.94 * w, -.24 * h), (.76 * w, -.52 * h), (.42 * w, -.7 * h), (0, -.76 * h)]
    full = half + [(-z, y) for z, y in reversed(half[1:-1])]
    return full

def octprof(w, h):
    return [(0, h), (0.6 * w, 0.8 * h), (w, 0.14 * h), (0.8 * w, -0.5 * h), (0, -0.74 * h),
            (-0.8 * w, -0.5 * h), (-w, 0.14 * h), (-0.6 * w, 0.8 * h)]

def ringprof(r, seg=16):
    return lambda w, h: [(math.cos(2 * PI * i / seg) * w, math.sin(2 * PI * i / seg) * h) for i in range(seg)]

# ================================================================ THÂN CHÍNH
ROOT = empty('Orthos', (0, 0, 0))
HULL = empty('HULL', (0, 0, 0), ROOT)

HS = [(-4.05, .92, .6, 0), (-3.75, 1.18, .84, 0), (-3.2, 1.3, .92, 0), (-1.5, 1.36, .95, 0),
      (0.3, 1.2, .86, 0), (1.3, 1.0, .74, 0), (2.0, .8, .6, 0)]
def hull_w(x, yfrac=.1):  # bề rộng thân tại x (để gắn chi tiết sát vỏ)
    for (x0, w0, h0, _), (x1, w1, h1, _) in zip(HS, HS[1:]):
        if x0 <= x <= x1:
            t = (x - x0) / (x1 - x0)
            return w0 + (w1 - w0) * t, h0 + (h1 - h0) * t
    return HS[-1][1], HS[-1][2]

p = Part('Hull')
p.loft(HS, 'hull', hullprof, inset=(0.035, -0.012))
p.finish(HULL, bevel=0)

# giáp lưng + sống lưng
p = Part('DorsalArmor')
p.loft([(-3.35, .48, .12, .86), (-2.7, .62, .2, .9), (0.4, .52, .18, .8), (1.25, .2, .06, .68)], 'plate', octprof)
for x in (-2.4, -1.6, -0.8, 0.0):
    p.box((x, 1.1, 0), (0.08, 0.06, 0.9), 'dark')
p.finish(HULL, bevel=0.012)

# giáp hông: các tấm chồng lớp, chừa khe
p = Part('SideArmor')
for x0, x1 in ((-3.45, -2.45), (-2.35, -1.2), (-1.1, 0.15), (0.25, 1.15)):
    xm = (x0 + x1) / 2
    w, h = hull_w(xm)
    p.box((xm, 0.32, w * .97 + 0.03), (x1 - x0, 0.36, 0.07), 'plate', r=(-0.55, 0, 0))
    p.box((xm, -0.28, w * .92 + 0.03), (x1 - x0 - 0.1, 0.18, 0.05), 'plate', r=(0.5, 0, 0))
p.mirror_z()
p.finish(HULL, bevel=0.012)

# dải đèn + cửa sổ
p = Part('Lights')
for x0, x1 in ((-3.6, 0.4), (0.4, 1.95)):
    w0, _ = hull_w(x0); w1, _ = hull_w(x1)
    p.bar((x0, 0.1, w0 + 0.02), (x1, 0.08, w1 + 0.02), 0.045, 'stripe')
x = -2.9
while x < 0.9:
    w, h = hull_w(x)
    p.box((x, 0.62, .8 * w + 0.03), (0.15, 0.07, 0.03), 'win', r=(-0.75, 0, 0))
    x += 0.3
p.mirror_z()
p.finish(HULL, smooth=0.2)

# cửa hút gió có lá chắn
p = Part('Intakes')
p.box((0.7, -0.22, 1.06), (1.1, 0.34, 0.3), 'plate', r=(0, 0.1, 0))
p.box((1.26, -0.22, 1.09), (0.08, 0.26, 0.24), 'dark')
for k in range(4):
    p.box((1.29, -0.31 + k * 0.06, 1.09), (0.02, 0.02, 0.24), 'light')
p.mirror_z()
p.finish(HULL, bevel=0.015)

# vây đuôi xiên
p = Part('TailFins')
fin = [(-4.1, 0.0), (-2.8, 0.0), (-3.5, 1.25), (-4.35, 1.35)]
for s in (1, -1):
    vs = [p.bm.verts.new((x, y + 0.55, 0)) for x, y in fin]
    f = p.bm.faces.new(vs); f.material_index = p.mi('plate')
    r = bmesh.ops.extrude_face_region(p.bm, geom=[f])
    nv = [e for e in r['geom'] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(p.bm, vec=(0, 0, 0.08), verts=nv)
    allv = vs + nv
    bmesh.ops.rotate(p.bm, cent=(0, 0.55, 0), matrix=Matrix.Rotation(s * -0.42, 3, 'X'), verts=allv)
    bmesh.ops.translate(p.bm, vec=(0, 0, s * 0.42), verts=allv)
    # đèn mép vây
    a = Vector((-3.5, 1.25 + 0.55, 0)); b = Vector((-4.35, 1.35 + 0.55, 0))
    R = Matrix.Rotation(s * -0.42, 3, 'X')
    pa = R @ (a - Vector((0, .55, 0))) + Vector((0, .55, s * 0.42 + s * 0.04))
    pb = R @ (b - Vector((0, .55, 0))) + Vector((0, .55, s * 0.42 + s * 0.04))
    p.bar(pa, pb, 0.05, 'stripe')
p.finish(HULL, bevel=0.015)

# tháp pháo lưng
p = Part('Turret')
p.cyl((-0.6, 0.98, 0), 0.42, 0.34, 0.2, 'plate', ax='y', seg=8)
p.box((-0.55, 1.13, 0), (0.62, 0.18, 0.5), 'plate')
for z in (0.16, -0.16):
    p.cyl((0.15, 1.13, z), 0.07, 0.055, 1.25, 'light', ax='x', seg=10)
    p.cyl((0.82, 1.13, z), 0.075, 0.075, 0.12, 'dark', ax='x', seg=10)
p.finish(HULL, bevel=0.01)

# sống bụng + ăng-ten
p = Part('Keel')
p.loft([(-3.0, .12, .1, -.72), (-2.4, .2, .16, -.8), (0.4, .18, .14, -.74), (1.2, .06, .05, -.6)], 'plate', octprof)
p.cyl((0.6, 1.0, 0.35), 0.012, 0.02, 0.6, 'light', ax='y', seg=6)
p.cyl((0.6, 1.0, -0.35), 0.012, 0.02, 0.45, 'light', ax='y', seg=6)
p.finish(HULL, bevel=0.008)

# ================================================================ KHOANG
Z = {}
def zone(k):
    Z[k] = empty('Z_' + k, (0, 0, 0), ROOT, zone=k)
    return Z[k]

# ---- Mô phỏng: mũi tàu + buồng lái
g = zone('train')
p = Part('Nose')
p.loft([(2.0, .8, .6, 0), (2.7, .62, .48, -.02), (3.4, .4, .32, -.06), (4.1, .16, .14, -.1), (4.55, .04, .04, -.12)], 'light', hullprof, inset=(0.03, -0.01))
p.loft([(1.15, .02, .02, .6), (1.8, .42, .27, .6), (2.7, .32, .18, .44), (3.25, .02, .02, .3)], 'glass', octprof)
# khung kính buồng lái
for x, w, y in ((1.75, .43, .6), (2.25, .39, .53), (2.75, .3, .44)):
    p.bar((x, y + 0.27 * (w / .42) - 0.01, 0), (x, y + 0.01, w * 1.01), 0.025, 'light')
    p.bar((x, y + 0.27 * (w / .42) - 0.01, 0), (x, y + 0.01, -w * 1.01), 0.025, 'light')
p.bar((1.2, 0.62, 0), (3.2, 0.32, 0), 0.03, 'light')
for s in (1, -1):
    p.bar((2.05, -0.02, s * 0.81), (4.2, -0.1, s * 0.12), 0.045, 'acc')
    p.bar((2.3, -0.3, s * 0.6), (3.9, -0.16, s * 0.12), 0.03, 'acc')
    # cánh tà nhỏ ở mũi
    p.slab([(3.2, s * 0.32), (2.5, s * 0.55), (2.35, s * 0.95), (2.75, s * 0.95)], -0.12, 0.04, 'plate')
p.cyl((4.85, -0.12, 0), 0.03, 0.015, 0.9, 'light', ax='x', seg=6)
p.torus((4.6, -0.12, 0), 0.06, 0.015, 'acc', ax='x', seg=12, tseg=6)
p.sphere((5.3, -0.12, 0), 0.05, 'acc', 10, 6)
p.finish(g, bevel=0)
empty('ANCHOR_train', (3.4, 0.35, 0), g, anchor='train')

# ---- K4: cánh xuôi + pháo đầu cánh
g = zone('ch4')
p = Part('Wings')
wing = [(1.0, 0.8), (-1.5, 3.8), (-2.6, 4.0), (-3.0, 3.5), (-2.7, 0.8)]
p.slab(wing, -0.05, 0.13, 'hull')
p.slab([(0.3, 0.8), (-1.4, 2.8), (-2.2, 2.9), (-2.5, 0.8)], 0.035, 0.04, 'plate')       # tấm gia cố
p.slab([(-1.55, 3.4), (-2.45, 3.55), (-2.7, 3.2), (-2.0, 3.05)], 0.035, 0.03, 'dark')  # cửa xả nhiệt
p.bar((1.0, 0.02, 0.8), (-1.5, 0.02, 3.8), 0.06, 'acc')
p.bar((-0.6, 0.04, 1.3), (-2.2, 0.04, 3.3), 0.035, 'acc')
p.bar((-2.7, 0.02, 0.85), (-3.0, 0.02, 3.45), 0.035, 'stripe')
# pháo đầu cánh
p.cyl((-2.0, -0.02, 3.92), 0.1, 0.12, 2.2, 'light', ax='x', seg=12)
p.cyl((-0.6, -0.02, 3.92), 0.06, 0.06, 0.8, 'dark', ax='x', seg=10)
p.cyl((-0.17, -0.02, 3.92), 0.075, 0.075, 0.1, 'light', ax='x', seg=10)
for x in (-1.4, -2.0, -2.6):
    p.torus((x, -0.02, 3.92), 0.125, 0.02, 'dark', ax='x', seg=14, tseg=5)
p.torus((-0.92, -0.02, 3.92), 0.12, 0.03, 'acc', ax='x', seg=16, tseg=6)
p.slab([(-2.6, 3.85), (-3.25, 3.85), (-3.35, 4.25), (-2.85, 4.2)], 0.12, 0.03, 'plate')  # vây nhỏ trên pháo
p.mirror_z()
p.finish(g, bevel=0.012)
empty('ANCHOR_ch4', (-1.6, 0, 3.4), g, anchor='ch4')

# ---- K1: ba động cơ + lửa
g = zone('ch1')
p = Part('Engines')
for y, z, r in ((0.02, 0.66, 0.42), (0.02, -0.66, 0.42), (0.66, 0, 0.3)):
    p.cyl((-4.0, y, z), r * 1.12, r, 1.4, 'plate', ax='x', seg=16)
    p.torus((-3.32, y, z), r * 1.02, 0.045, 'dark', ax='x', seg=20, tseg=6)
    p.cyl((-3.6, y, z), r * 1.18, r * 1.18, 0.16, 'dark', ax='x', seg=16)
    for k in range(8):   # cánh tản nhiệt
        t = 2 * PI * k / 8 + PI / 8
        p.box((-4.15, y + math.cos(t) * r * 1.13, z + math.sin(t) * r * 1.13), (0.7, 0.03, r * 0.22), 'light',
              r=(t - PI / 2, 0, 0))
    p.cyl((-4.86, y, z), r * 1.15, r * 0.95, 0.32, 'dark', ax='x', seg=16, cap=False)   # loa phụt loe
    p.torus((-4.72, y, z), r * 1.05, 0.05, 'acc', ax='x', seg=24, tseg=6)
    p.torus((-5.01, y, z), r * 0.98, 0.025, 'acc', ax='x', seg=24, tseg=5)
    p.cyl((-4.76, y, z), r * 0.9, r * 0.9, 0.02, 'acc', ax='x', seg=20)
    p.cyl((-4.72, y, z), r * 0.32, r * 0.18, 0.18, 'dark', ax='x', seg=10)              # chóp dẫn dòng
p.finish(g, bevel=0.01)
for y, z, r in ((0.02, 0.66, 0.42), (0.02, -0.66, 0.42), (0.66, 0, 0.3)):
    empty('FLAME', (-4.78, y, z), g, flame_r=r)
empty('ANCHOR_ch1', (-4.4, 0.9, 0.3), g, anchor='ch1')

# ---- K2: vòng xoay quanh thân
g = zone('ch2')
p = Part('RingCollar')    # vòng đỡ đứng yên ôm thân
p.loft([(-0.42, 1.42, 1.0, 0), (-0.32, 1.47, 1.04, 0), (-0.18, 1.47, 1.04, 0), (-0.08, 1.42, 1.0, 0)], 'plate', hullprof, caps=False)
for a in range(6):
    t = a * PI / 3 + PI / 6
    p.bar((-0.25, 1.0 * math.cos(t), 1.42 * math.sin(t)), (-0.25, 1.38 * math.cos(t), 1.38 * math.sin(t) * 1.0), 0.07, 'light')
p.finish(g, bevel=0.008)
spin = empty('SPIN_ring', (-0.25, 0, 0), g, spin_ax='x', spin_v=0.5)
p = Part('Ring')
p.torus((0, 0, 0), 1.5, 0.09, 'light', ax='x', seg=48, tseg=10)
p.torus((0.11, 0, 0), 1.5, 0.035, 'acc', ax='x', seg=48, tseg=6)
p.torus((-0.11, 0, 0), 1.5, 0.035, 'acc', ax='x', seg=48, tseg=6)
for i in range(6):
    t = i * PI / 3
    p.box((0, 1.5 * math.cos(t), 1.5 * math.sin(t)), (0.36, 0.24, 0.26), 'plate', r=(t, 0, 0))
    p.box((0, 1.66 * math.cos(t), 1.66 * math.sin(t)), (0.2, 0.06, 0.12), 'acc', r=(t, 0, 0))
for i in range(12):
    t = i * PI / 6 + PI / 12
    p.box((0, 1.5 * math.cos(t), 1.5 * math.sin(t)), (0.26, 0.05, 0.1), 'dark', r=(t, 0, 0))
p.finish(spin, origin=(-0.25, 0, 0), bevel=0.01)
empty('ANCHOR_ch2', (-0.25, -1.5, 0.2), g, anchor='ch2')

# ---- K3: đài radar
g = zone('ch3')
p = Part('RadarBase')
p.cyl((1.0, 0.8, 0), 0.36, 0.27, 0.26, 'plate', ax='y', seg=8)
p.torus((1.0, 0.93, 0), 0.27, 0.025, 'acc', ax='y', seg=16, tseg=5)
p.finish(g, bevel=0.01)
spin = empty('SPIN_radar', (1.0, 0.92, 0), g, spin_ax='y', spin_v=0.8)
p = Part('Radar')
o = Vector((1.0, 0.92, 0))
p.cyl((1.0, 1.12, 0), 0.05, 0.04, 0.4, 'light', ax='y', seg=8)
# chảo: nửa cầu dẹt nghiêng
tilt = Euler((0, 0, -1.2)).to_matrix()
dc = o + Vector((0.1, 0.48, 0))
segs, rings = 20, 6
vv = []
for a in range(rings + 1):
    th = 0.95 * a / rings
    row = []
    for b in range(segs):
        ph = 2 * PI * b / segs
        q = Vector((math.sin(th) * math.cos(ph), math.cos(th), math.sin(th) * math.sin(ph))) * 0.48
        row.append(p.bm.verts.new(dc + tilt @ q))
    vv.append(row)
mi = p.mi('light')
for a in range(rings):
    for b in range(segs):
        f = p.bm.faces.new((vv[a][b], vv[a][(b + 1) % segs], vv[a + 1][(b + 1) % segs], vv[a + 1][b])); f.material_index = mi
# vành chảo + gân
rim = [vv[-1][b].co.copy() for b in range(segs)]
ca = dc + tilt @ Vector((0, math.cos(0.95) * 0.48, 0))
for b in range(0, segs, 5):
    p.bar(ca + tilt @ Vector((0, -0.02, 0)), rim[b], 0.02, 'light')
for b in range(segs):
    p.bar(rim[b], rim[(b + 1) % segs], 0.035, 'acc')
p.bar(dc + tilt @ Vector((0, 0.1, 0)), dc + tilt @ Vector((0, 0.62, 0)), 0.02, 'light')
p.sphere(dc + tilt @ Vector((0, 0.66, 0)), 0.06, 'acc', 10, 6)
p.finish(spin, origin=tuple(o), bevel=0)
empty('ANCHOR_ch3', (1.1, 1.6, 0), g, anchor='ch3')

# ---- K5: lõi phản ứng
g = zone('ch5')
p = Part('ReactorBase')
p.cyl((-2.2, 0.98, 0), 0.72, 0.58, 0.3, 'plate', ax='y', seg=6)
p.cyl((-2.2, 1.15, 0), 0.5, 0.46, 0.06, 'dark', ax='y', seg=12)
for a in range(4):
    t = a * PI / 2 + PI / 4
    p.bar((-2.2 + 0.46 * math.cos(t), 1.12, 0.46 * math.sin(t)), (-2.2 + 0.4 * math.cos(t), 1.72, 0.4 * math.sin(t)), 0.05, 'light')
p.torus((-2.2, 1.74, 0), 0.4, 0.03, 'light', ax='y', seg=20, tseg=5)
p.sphere((-2.2, 1.36, 0), 0.3, 'acc', 20, 12)
p.finish(g, bevel=0.01)
spin = empty('SPIN_core', (-2.2, 1.36, 0), g, spin_ax='y', spin_v=1.2)
p = Part('Gyro')
c = Vector((-2.2, 1.36, 0))
R1 = Euler((PI / 2.4, 0, 0)).to_matrix()
R2 = Euler((-PI / 2.4, 0, 0.6)).to_matrix()
for R, m, rr in ((R1, 'acc', 0.5), (R2, 'light', 0.44)):
    pts = [c + R @ Vector((math.cos(2 * PI * i / 32) * rr, math.sin(2 * PI * i / 32) * rr, 0)) for i in range(32)]
    for i in range(32):
        p.bar(pts[i], pts[(i + 1) % 32], 0.045 if m == 'acc' else 0.035, m)
p.bar(c - Vector((0.58, 0, 0)), c + Vector((0.58, 0, 0)), 0.05, 'light')
p.finish(spin, origin=tuple(c), bevel=0)
empty('ANCHOR_ch5', (-2.2, 1.75, 0), g, anchor='ch5')

# ---- Tách lớp: khoang thí nghiệm dưới bụng
g = zone('lab')
p = Part('LabPod')
for x in (-1.9, -0.5):
    p.box((x, -0.82, 0), (0.2, 0.4, 0.34), 'plate')
p.loft([(-2.5, .02, .02, -1.12), (-2.35, .3, .3, -1.12), (-2.1, .38, .38, -1.12), (-0.3, .38, .38, -1.12),
        (-0.05, .3, .3, -1.12), (0.1, .02, .02, -1.12)], 'light', ringprof(1, 16), inset=(0.02, -0.008))
for x in (-1.8, -1.45, -1.1, -0.75):
    for s in (1, -1):
        p.box((x, -1.06, s * 0.37), (0.2, 0.12, 0.04), 'acc')
p.torus((-2.1, -1.12, 0), 0.39, 0.03, 'acc', ax='x', seg=20, tseg=6)
p.torus((-0.3, -1.12, 0), 0.39, 0.03, 'dark', ax='x', seg=20, tseg=6)
p.cyl((-1.2, -1.53, 0), 0.08, 0.05, 0.12, 'dark', ax='y', seg=8)
p.sphere((-1.2, -1.6, 0), 0.06, 'acc', 10, 6)
p.finish(g, bevel=0.008)
empty('ANCHOR_lab', (-1.0, -1.55, 0.3), g, anchor='lab')

# ---- Xưởng Thiết Kế: máy chiếu hologram
g = zone('tk')
p = Part('Projector')
p.cyl((-3.2, 1.03, 0), 0.32, 0.22, 0.18, 'plate', ax='y', seg=10)
p.torus((-3.2, 1.15, 0), 0.2, 0.035, 'acc', ax='y', seg=20, tseg=6)
p.cyl((-3.2, 1.17, 0), 0.08, 0.05, 0.08, 'light', ax='y', seg=8)
for a in range(3):
    t = a * 2 * PI / 3
    p.bar((-3.2 + 0.28 * math.cos(t), 1.1, 0.28 * math.sin(t)), (-3.2 + 0.22 * math.cos(t), 1.3, 0.22 * math.sin(t)), 0.035, 'light')
p.finish(g, bevel=0.008)
p = Part('HoloBeam')
p.cyl((-3.2, 1.55, 0), 0.06, 0.62, 0.75, 'holo', ax='y', seg=20, cap=False)
p.finish(g, smooth=3.1)
empty('HOLO', (-3.2, 1.98, 0), g, holo=1)
empty('ANCHOR_tk', (-3.75, 1.98, 0), g, anchor='tk')

# ---------------------------------------------------------------- xuất
bpy.context.view_layer.update()
tris = 0
dg = bpy.context.evaluated_depsgraph_get()
for o in col.objects:
    if o.type == 'MESH':
        e = o.evaluated_get(dg).to_mesh()
        e.calc_loop_triangles(); tris += len(e.loop_triangles)
        o.evaluated_get(dg).to_mesh_clear()
print('ORTHOS triangles:', tris)

os.makedirs(os.path.dirname(OUT), exist_ok=True)
for o in bpy.context.view_layer.objects: o.select_set(o.name in col.objects)
bpy.ops.export_scene.gltf(filepath=OUT, export_format='GLB', use_selection=True, export_apply=True,
                          export_extras=True, export_yup=True, export_materials='EXPORT', export_cameras=False,
                          export_lights=False, export_animations=False)
print('ORTHOS saved', os.path.abspath(OUT), os.path.getsize(OUT))

# chạy bằng dòng lệnh (không mở giao diện) thì lưu luôn file .blend để lần sau mở ra sửa tay
if bpy.app.background:
    bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, 'orthos.blend'), compress=True)
    print('ORTHOS blend saved')
