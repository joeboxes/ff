# Averaging





### Scales

find the average in log-space

```
s = [1.5 1.9 2.0]; % 1.786 v 1.80
s = [0.5 0.7 0.9 1.1 1.2]; % 0.839 v 0.88

l = log(s)

s_a = mean(s)
l_a = mean(l)
exp(l_a)
```









linear estimates



linear graph updates





nonlinear gradient descent




### 1D:

edge:
	v_j = v_i * s_ij
	log(v_j) = log(v_i) + log(s_ij)


additively:


a_i = a_j + s_ij
=>
0 = a_j - a_i + s_ij


	 a_i     a_j      c         ... 
[ ... -1 ...  1  ... s_ij ]   [ a_i ]   [ 0 ]
[                         ] x [ a_j ] = [ 0 ]
                               ...

EIGEN VECTORS
SVD
OTHER THING?


NONLINEAR ERROR:
?



---


### 2D translation:

edge:
	v_i = v_j + r_ij
	< v_i.x , v_i.y >  =  < v_j.x, v_j.y >  +  < r_ij.x, r_ij.y >


A) 

|| v_i - v_j || = || r_ij || 


(v_i.x - v_j.x)^2 + (v_i.y - v_j.y)^2  = r_ij.x^2 + r_ij.y^2
v_i.x^2 + v_j.x - 2&middot;v_i.x^2&middot;v_j.x  +  v_i.y^2 + v_j.y - 2&middot;v_i.y^2&middot;v_j.y  = r_ij.x^2 + r_ij.y^2
...


B) incorrectly independent simplification:
v_j.x = v_i.x + r_ij.x
v_j.y = v_i.y + r_ij.y

=> simplifies to 1D


### 2D orientation:

edge: angle differentials
	v_i = v_j + r_ij (modulo 2&pi;)

nonlinearity of modulo 2&pi;


nonlinear error:
	angular:
		minAngle(a,b)
		= 
	vector:
		angle( vector(a), vector(b) )



doing vector add is only a coarse approx
 using mass / moment movement value is better
 	- equa-distance error when data is ~ exactly uniform









### 3D translation:


edge: 
	v_i = v_j + r_ij



### 3D orientation:
	locations on sphere are only 2 dof
	- representations:
		- 3-Vector 
		- 


	twist = normal direction + 2D angular difference

	average:
		- normal direction = unit sphere normal weighted averaging
		- angular average = 2D angular average of DIFFERENCES of angles 




### 3D translation + orientation

...









NONLINEAR ERROR:

distance between x/y/z axis unit vectors


...



### Combined Process for View Graph Error Minimizing


#### Scaling


#### Init Locations


#### Init Orientations


#### Init Combined Location + Orientation


#### Nonlinear Error Locations


#### Nonlinear Error Orientations


#### Nonlinear Error Combined Location + Orientations




functions:
	- scale -> log & log -> scale
	edges: [idA, idB, value, error]
	- graphEdgeAverage1D(edges)
		- init
		- linear
		- nonlinear
	- graphEdgeAverageV2D(edges)
		- init
		- linear
		- nonlinear
	- graphEdgeAverageV3D(edges)
		- init
		- linear
		- nonlinear
	- graphEdgeAverageAngle2D(edges)
		- init
		- linear
		- nonlinear
	- graphEdgeAverageAngle3D(edges)
		- init
		- linear
		- nonlinear
	- graphEdgeAverageOrientation3D(edges)
		- init angle2D
		- init angle3D
		- nonlinear axes3D
	- graphEdgeAverageCombined3D(edges)
		- init orientation 3D
		- init location 3D
		- nonlinear axes3D





#### Combined Location + Orientations
	- need some way to connect the location & orientation at same time ...
		=> solved rotations will have no relation to translations
	- need to solve together simultaneously
		-> average ABSOLUTE transtorms at same time, but relative isn't enough


	- find optimal rotations first:
		- &theta;<sub>B</sub> = &theta;<sub>A</sub> = &theta;<sub>AB</sub>
		- linear initialize
		- nonlinear optimize
	- find optimal combined rotation + translation second:
		- t<sub>B</sub> = t<sub>A</sub> + t<sub>AB</sub> &ang; &theta;<sub>AB</sub>
		- linear initialize
		- nonlinear optimize



	- init
		- @ 0,0,0
	- linear:
		- average a set of absolute matrices:
		- translation
		- direction Z
		- rotation @ Z
	- nonlinear:
		- values:
			tx, ty, tz, rx, ry, rz
		- error:
			relative ACTUAL (MODEL)
			relative EDGE (SAMPLES)
			d(a_o,e_o)^2 +  ??? 
			d(a_x,e_x)^2 + 
			d(a_y,e_y)^2 + 
			d(a_z,e_z)^2




A = UDV^T




https://censi.science/pub/research/2013-mole2d-slides.pdf

http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.116.8981&rep=rep1&type=pdf


https://www.ecse.rpi.edu/~qji/Papers/isprs_pose2.pdf

http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.116.8981&rep=rep1&type=pdf
https://www.ece.ucsb.edu/~hespanha/published/cdc07_asymtime.pdf
http://ece-research.unm.edu/chaouki/PAPERS/Journals/Complex%20Networks%20CSM-Special%20Issue/Full%20papers/Hespanha.pdf

https://pdfs.semanticscholar.org/17da/80fc3cd55c3572ac3a411cd1a61dc267b505.pdf





???
http://faculty.washington.edu/sbrunton/me565/pdf/CHAPTER1.pdf

http://graphics.stanford.edu/~smr/ICP/comparison/eggert_comparison_mva97.pdf






---
https://www.cs.toronto.edu/~urtasun/courses/CV/lecture09.pdf
https://www.cs.toronto.edu/~urtasun/courses/CV/cv.html




























---





