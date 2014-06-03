# Notes
**For now this will just be a place for random notes**

7. [Surface Reconstruction](#SURFACE)



<a name="SURFACE"></a>
## Surface Reconstruction
*(Triangulating Point Set Surfaces with Bounded Error)*
<br/>
**Input:** Point Cloud (list of 3D points), &rho; (curvature coverage &prop; 1/error), &tau; (smoothing factor)
<br/>
**Output:** Triangle Soup
<br/>

### Definitions:
<br/>
**Osculating Sphere**: A point in a plane (P) and a normal to that plane (N) has a curvature that can be approximated at the single point (P) by a sphere with radius (R) exactly tangent to the plane (N+P). A larger sphere translates to less curvature *[lim<sub>R&rarr;&infin;</sub> = a plane]*.
<br/>
center of ^^^ sphere = a = x + &rho;N + (&rho;'/&tau;)B
a = center of sphere
x = ?
&rho; = radius of curvature;
&tau; = torsion
N = unit normal vector
B = unit binormal vector
<br/>
radius of ^^^ sphere R = sqrt(&rho;<sup>2</sup> + (&rho;'/&tau;)<sup>2</sup>)
R &equiv; 1/&kappa;
<br/>
T = unit tangent vector = r'/|r|
N = (1/&kappa;)&dot;T'
&tau = -N&dot;B'
<br/>
<br/>
**Radial Basis Function (RBF)**: some function that only depends on distance from some center point: &Phi;(x,c) = &Phi;(||x-c||)
<br/>
solid angle = "3D" angle - a cone (measured in steradians)
<br/>
<br/>
Lipshitz Continuity is a condition on the maximum rate of change of smoothness
modulus of uniform continuity
<br/>
Lipshitz Condition = ?
<br/>
Lipshitz Number = ?
<br/>
<br/>
Hausdorf Distance = measures how far two sets *of metric space* are from eachother: h(A,B) = MAX<sub>a&in;A</sub>[ MIN<sub>b&in;B</sub> d(a-b) ]
- *d() is some distance measure, for simple points d can be ||a-b||*
```
for each a &in; A
    for each b &in; B 
        d = min(||a-b||, d)
    D = max(d,D)
```
*d() = distance, a = point, b = point*
<br/>
Hausdorf Error = distance between the triangle and subtended osculating sphere
<br/>


<br/>
<br/>
sin(2&beta;)/b = sin(&gamma;)/c = sin(3&beta;)/c
<br/>
The upper bound on gamma is 3&beta; &rarr; when isosceles: 3&beta; = &pi; ?

&beta; + &beta; + 3&beta; =  &pi;
5&beta; = pi?

&gamma; =?= 3&beta;
<br/>
b = c&dot;sin(2&beta;)/sin(3&beta;) = &eta;c


<br/>
ideal triangle = subtends a constant solid angle
<br/>
&rho; = angle of osculating circle = inverse of absolute curvatrure &kappa;
<br/>
c = 
<br/>
b = maximum querying radius (of guidance field) => result of maximum possible curvature
<br/>
&beta; = isosceles base angle (only free param of new triangle)
<br/>
&gamma; = ?
<br/>
&kappa;<sub>1</sub> = ?
<br/>
&kappa;<sub>2</sub> = ?
<br/>
&kappa; = max(|&kappa;<sub>1</sub>|,|&kappa;<sub>2</sub>|) = minimum of absolute curvature
<br/>
L = &rho;/&kappa; = ideal edge length
<br/>
? = approximation error
<br/>
&tau; = smoothing factor, relates MLS h value to neighborhood radius
<br/>
&epsilon; = Hausdorf distance between triangle mesh and surface patch under it is AT MOST: r(1 - sqrt(1+8cos(&rho;))/3) *(r is curvature radius)* => upperbound on the Hausdorf Error
- **ALTERNATIVE INPUT**: could be &epislon;, then having &rho; vary with &epsilon; and r:
    - &rho; = acos(9/[8(1 - &epsilon;/r)<sup></sup>] - 1)
<br/>
normal = integral of curvature 
<br/>
**L(x,y,z)** = guidance field (global information) is ideal edge size for a triangle at each point in space (scalar) ; ideal edge length at any point in &reals;<sup>3</sup> is ideal edge length at closest point (which is in turn projected onto MLS surface)
<br/>
local bivariate polynomials = ? ?x*y?
<br/>
<br/>
<br/>
seed triangle: first triangle, generated at random location on surface
<br/>
always grow with isosceles triangles
<br/>
**Edge-Front**: List of edges representing the border of the current triangulated surface
<br/>
**Triangle-Grow**: create triangle from from front edge and new vertex
<br/>
**Ear-Cut**: create triangle from 3 vertices on front (can cause merge/split event)
<br/>
**Merge-Event**: ? uses existing front vertex
<br/>
**Split-Event**: ? uses existing front vertex 
<br/>
<br/>
<br/>
**MLS (Moving Least Squares**: specifies the underlying surface ? 
<br/>
<br/>
**MSL Projection**:  projects point r in &reals;<sup>3</sup> to surface: r' = P(r)
- surface = set of points that project to themselves
- 1:
    - fit a reference plane H = (q,n) to neighborhood of r (q is point on plane, n is unit normal vector)
    - H is selected to minimize the energy function: min<sub>q</sub> &sum;<sub>i</sub>&lt;n,p<sub>i</sub>-q&gt;<sup>2</sup> &dot; &Theta;(||p<sub>i</sub>-q||)
    - p<sub>i</sub> = i<sup>th</sup> neighbor of r
    - n = (r-q)/||r-q||
    - &Theta(&dot;) = smooth, monotonically decreasing function
    - minimum is found via gradient descent
- 2:
    - locally fit bivariate polynomial of low degree g over H
    - p<sub>i</sub> = (u<sub>i</sub>,v<sub>i</sub>,w<sub>i</sub>) = coordinates defined by H
    - g = polynomial that minimizes weighted least squares error: &Sigma;<sub>i</sub> (g(u<sub>i</sub>,v<sub>i</sub>) - w<sub>i</sub>)<sup>2</sup> &dot; &Theta;(||p<sub>i</sub>-q||)
    - projection r' = P(r) = q + g(0,0)&dot;n
    - weight function has scalar parameter h = determines amount of smoothing applied to the data = function lof local feature size
    - L(x) = local feature size of point x = radius of the k nearest neighbors of x
    - h(x) = scale = &tau;&dot;weighted_average(L(Nbhd(x)))
    - &tau; = amount of smoothing/denoising to apply (user input)
    - q<sub>0</sub> = initial guess for minimum point for minimizing process of q
        - heuristic: q<sub>near</sub>, q<sub>far</sub>
        - c<sub>0</sub> = centroid of neighborhood of r
        - n<sub>0</sub> = normalized eigenvector of covariant matrix of neighborhood of r
        - q<sub>near</sub> = projection of r onto plane defined by c<sub>0</sub> and n<sub>0</sub>
            - q<sub>near</sub> = r - &lt;nq<sub>near</sub>,r-cq<sub>near</sub>&gt;nq<sub>near</sub>
        - q<sub>far</sub> = c<sub>0</sub>
    - q<sub>0</sub> = &alpha;&dot;q<sub>near</sub> + (1-&alpha;)q<sub>far</sub>
        - &alpha; = 1 for r = c<sub>0</sub>  and  &alpha; = 0 for ||r-c<sub>0</sub>|| = Lc<sub>0</sub>
<br/>
<br/>
? = surface = implicit surface (zero-set)
surface is defined by a single real number, the radius of curvature
<br/>
<br/>
**Bounded Hausdorff Distance:** Hausdorff distance between two surfaces A and B in &reals;<sup>3</sup> = &epsilon;(A,B) = max<sub>a&isin;A</sub>(min<sub>b&isin;B</sub>||a-b||)
<br/>
<br/>
barycenter of triangle &equiv; CoM = centroid of triangle (lines from center of edge to opposite vertex all meet at point)
<br/>
incenter of triangle = lines from vertex at half-angle direction meet at point
<br/>
circumcenter of triangle = perpendicular lines from midpoint of each edge meet at point (could be outside)
<br/>
orthocenter of triangle = perpendicular lines from each edge that pass through opposite vertex meet at point (could be outside)
<br/>
<br/>
grand (great) circle of a sphere: largest circle that intersects a sphere (have same diameter) (infinite number)
<br/>
<br/>

<br/>

### Algorithm

- initial seed triangle:
    - random point of cloud
    - projected point to MLS surface
    - find edge size appropriate for region (lookup L(x,y,z)?)
    - decide triangle edge length: force equalateral
    - inductively find best initial size:
        - query curvature and bracket and interval bisection to find best initial size
        - best triangle is one where query length = length (fixed point of f)

- 


- add new vertex
    - Vertex-Prediction: vertex position is first estimated via prediction operator... ?
        - consider current edge length and maximum curvature in triangle neighborhood
    - vertex projected to MLS surface
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>


**Front**: souble linked list (traversal) plus priority queue (best edge [(ideal length)/(actual length) closest to 1])

deferred edge: second priority - because edge will introduce a bad triangle

boundary: anisotropy (using best fit local plane) maximum angle between local points and reference point if above a threshold (150&deg;)

firstFront()

**vertexPredict(edge, field)**
- need to know absolute curvature &kappa; (from &kappa;<sub>1</sub> and &kappa;<sub>2</sub>). L = &rho;/&kappa;

&eta; = ?
c = edge.length();
b =  c * &eta;
midpoint = e.midpoint()
i = fieldMinInSphere(field, midpoint,b)
&beta; = ?
baseAngle = min(max(t,60-&beta;),60+&beta;) // clamp base angle of triangle &isin; [60-&beta;,60+&beta;]
p = Point() // forms angle 180-2*baseAngle with edge
return MLSProject(p)

**fieldMinInSphere(field, center,radius)**
-?

**MLSProject(point)**
-project point onto MLS Surface?

**Triangulate(field)**
- ?
 
fronts = FirstFront()
while(frontSet.length>0){
    current = fronts.first()
    // close front with only 3 vertexes - what about initial front?
    if(current.vertexCount()==3){
        current.closeFront()
        fronts.removeFront(current)
        continue
    }
    // ?
    e = current.bestEdge()
    if(e.canCutEar()){
        e.cutEar()
        continue
    }
    // 
    p = vertexPredict(edge,field)
    if( !triangleTooClose(e,p) ){ // 
        e.growTriangle() // ?
    }else{ // 
        front = closestFront(e,p)
        if(front==current){ // same front?
            front = fronts.split(current-front) // separate front from current
            fronts.addFront( front ) // add as new front
        }else{ // different fronts
            front = merge(current,front) // combine
            fronts.removeFront(front) // remove second copy from list
        }
    }
}

**triangleTooClose()**
- whether added point is closer than allowed to to existing triangulation (half ideal edge length at point p), if yes, topological even occurs

x growTriangle()

closestFront()

**canCutEar()**
- returns true if possible to form 'good' triangle (all resulting angles &lt; 70&deg;) by connecting edge e to any adjacent edges

x cutEar()

bestEdge()

split()

merge()

closeFront()



How do you choose the next point/location to add as a vertex (predict)?











PointCloud
    - organize()

Front:
    - edges[] (doubly-linked list & priority queue)
    - TriangleGrow(vertex,edge)
        - create new triangle with vertex and internal edge - remove old edge from front, add 2 new edges
        - if vertex is too close, merge with existing - causes topoligical event:
            - split
            - merge
    - EarCut(edgeA,edgeB)
        - create new triangle with 3 vertices on front - remove 2 old edges, add 1 new edge
Full-Front:
    - fronts[]
    





initial vertex should be oriented such that the surface points in the correct direction (for culling)
triangles may need to, be checked for orientation after algorithm completes by checking with *outside* points or some idea of surface normals

what about 'disconnected' surfaces? specify some border (convex hull)?

### Curvature
**measurement of how quickly a curve/surface changes direction - sharpness - deviation from straight line**
<br/>
**Change in Position Vector dR**: (infitesimal arc) &approx; [r(x+&Delta;x,f(x+&Delta;x)) - (x-&Delta;x,f(x-&Delta;x))]/[2&Delta;x]
<br/>
**Unit Tangent Vector T**: dR/||dR||  (unit version of dR)
<br/>
**Unit Normal VectorN**: &Kappa;/||&Kappa;|| (always on side of osculating circle/sphere), *similar* Normal vector can be chosen using dR to be orthogonal to T - consistent 'side' of curve/path
<br/>
**Binormal Vector B**: T &times; N (something to do with torsion - not useful in 2D?)
<br/>
**Curvature-Normal Vector &Kappa;** = ||dT/ds|| = ||T'(s)|| &approx; [T(x+&Delta;x) - T(x-&Delta;x)]/[2&Delta;x] (~second vector derivative)
<br/>
**Curvature &kappa**: = ||&Kappa;||
<br/>
**Radius of Curvature**: 1/&Kappa; (radius of osculating sphere)
<br/>
**Arc Length s**: &int; |dR| dt
<br/>
curvature of line = 0; curvature of circle = 1/R
<br/>
<br/>
<br/>
<br/>
 ? (polar coords shows T,N more clearly)
<br/>




### Definition of 3D Plane
<br/>
**Equation of a plane**: ax + by + cz + d = 0 &rarr; normal vector (n): &lt;a,b,c&gt; point in plane (q): (a&middot;d,b&middot;d,c&middot;d)/||n||
<br/>
**Plane including origin**: d=0 &rarr; ax + by + cz = 0
<br/>
**Useful definition of a plane**: normal to plane: n, point in plane: q
<br/>
n = &lt;a,b,c&gt;, q = &lt;r,s,t&gt;, p = (x,y,z)
<br/>
dot(n,p-q) = 0
<br/>
&lt;a,b,c&gt;*&lt;x-r,y-s,z-t&gt; = 0
<br/>
ax + by + cz - (ar+bs+ct) = 0
<br/>
d = -(ar+bs+ct)
<br/>
assuming q specifies a point from the origin, along the normal: q = g*(a,b,c) = (r,s,t)
<br/>
d = (a*ga+b*gb+c*gc)
<br/>
d = g(aa+bb+cc)
<br/>
assuming n is a normal vector (aa+bb+cc) = 1, and g = d
<br/>
is n is not normal, d = g||n||<sup>2</sup>
<br/>
<br/>

### (Geometric) Least Squares Planar Surface From Set of Points
<br/>
**Set of points (&reals;<sup>3</sup>) to fit**: P
<br/>
**Covarint Matrix A**: measures orthogonal error to a plane
```
[ cov(x,x), cov(x,y), cov(x,z) ]
[ cov(y,x), cov(y,y), cov(y,z) ]
[ cov(z,x), cov(z,y), cov(z,z) ]
```
*cov(a,b) = &Sum;<sub>i</sub> (a-&mu;<sub>a</sub>)(b-&mu;<sub>b</sub>)*
<br/>
*&mu;<sub>a</sub> = (1/N)&Sum;<sub>i</sub> a*
<br/>
*N = number of elements*
<br/>
*i = i<sup>th</sup> element*
<br/>
*x,y,z are coordinates of P<sub>i<sub>*
<br/>
**Point in plane?**: center of mass of points?
<br/>
****: ?
<br/>
Solve Ax = b &rarr; x = pinv(A)b ?
<br/>
<br/>
Primary eigenvector = normal ?
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>



### Intersection of Line and Plane (Point Projected onto Plane)
**point in space (&reals;<sup>3</sup>)**: p
<br/>
**plane defined by point and unit normal**: q, n
<br/>
**projection of point p onto plane (result)**: r
<br/>
r is also equal to the intersection of the plane (q,n) with a line p,n (renamed o,d here)
<br/>
**Line to test for intersection**: o + t&middot;d (o=origin, d=direction, t=scale along direction)
<br/>


Solving for t, where o + t&middot;d = r (point of intersection):
<br/>
dot(n, r - q) = 0
<br/>
n.x(r.x - q.x) + n.y(r.y - q.y) + n.z(r.z - q.z) = 0
<br/>
n.x(o.x + t&middot;d.x - q.x) + n.y(o.y + t&middot;d.y - q.y) + n.z(o.z + t&middot;d.z - q.z) = 0
<br/>
n.x&middot;o.x + t&middot;n.x&middot;d.x - n.x&middot;q.x + n.y&middot;o.y + t&middot;n.y&middot;d.y + n.y&middot;o.y + t&middot;n.z&middot;d.z - n.z&middot;q.z = 0
<br/>
t&middot;n.x&middot;d.x + t&middot;n.y&middot;d.y + t&middot;n.z&middot;d.z = n.x&middot;q.x - n.x&middot;o.x + n.y&middot;q.y - n.y&middot;o.y + n.z&middot;q.z - n.z&middot;o.z
<br/>
t(n.x&middot;d.x + n.y&middot;d.y + n.z&middot;d.z) = n.x&middot;q.x - n.x&middot;o.x + n.y&middot;q.y - n.y&middot;o.y + n.z&middot;q.z - n.z&middot;o.z
<br/>
t(n.x&middot;d.x + n.y&middot;d.y + n.z&middot;d.z) = n.x(q.x-o.x) + n.y(q.y-o.y) + n.z(q.z-o.z)
<br/>
t = (n.x(q.x-o.x) + n.y(q.y-o.y) + n.z(q.z-o.z))/(n.x&middot;d.x + n.y&middot;d.y + n.z&middot;d.z)
<br/>
t = dot(n,q.x-o.x)/dot(n,d)
<br/>

**KEY NOTES:**
<br/>
if the denominator equals zero (dot(n,d)) &rarr; the line is in the plane
<br/>
if t equals zero (dot(n,q.x-o.x) equals zero) &rarr; point is already in the plane


<br/>
<br/>
<br/>
<br/>


**TODO:**
- MLS
	x determing MLS surface for any point
	x display MLS as sampled points on surface
	- weighted?
	- 'snapping' to closest sample point?
- how to get kappa - curvature of the MLS surface
	- maximum absolute curvature?
- container class for point cloud
- how to 'query' field
- how to generate first triangle


RESULTS DATA:

cactusPoi = 3.3E3;
cactusTim = [63.6,20.3,9.4];
cactusTri = [21E3,7E3,3E3];
torusPoi = 30E3;
torusTim = [80.8,32.5,22.5];
torusTri = [24E3,8E3,3E3];
igeaPoi = 276E3;
igeaTim = [892,357,100];
igeaTri = [91E3,32E3,11E3];
hold off;
plot(cactusTim,cactusTri,"r-x");
hold on;
plot(torusTim,torusTri,"b-x");
plot(igeaTim,igeaTri,"m-x");


---

(Felix Hausdorff)[Felix Hausdorff]
(Hausdorf Distance)[http://cgm.cs.mcgill.ca/~godfried/teaching/cg-projects/98/normand/main.html]
(osculating sphere)[http://mathworld.wolfram.com/OsculatingSphere.html]
(Curvature)[http://mathwiki.ucdavis.edu/Calculus/Vector_Calculus/Vector-Valued_Functions_and_Motion_in_Space/Curvature_and_Normal_Vectors_of_a_Curve]
(Random Points on a Sphere)[http://mathworld.wolfram.com/SpherePointPicking.html]