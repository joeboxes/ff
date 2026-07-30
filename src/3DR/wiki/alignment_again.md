# Topics & Algorithms for specific view pair alignment

focus on deciding on a robust algorithm


## LIST OF TOPICS FOR ALGORIHTM
- sequential (global) vs iteritive refinement
- marking bad points (high error or similar metric)
- local minima avoiding & local / exhaustive checks
- solution averaging
- using exact calculations/estimates or use 'trajectories'
- minimum / variables to operate over (eg 6 DoF or 3 rot 3 trans, ...)
- combining different error metrics simultanrously or sequentially
- different definitions of geometries
- best neighbor candidate for comparing surfaces
- track matches vs neighbor matches
- gathering more points


## Sequential v iteritive refinement

Sequential alignment will progressively move the new solution away from old solution and as more views are solved for, the remaining views' starting location requires more adjustment.
The adjusted starting point is some combination of previous relative relationships, new relative relationships, and new absolute location
average of: new best guess only based on views added to new solution, other relationships are lost

iteritive refinment seems to get stuck in local minima:
reducing error with eg view A will result in error with eg view B getting worse

## Simulaneious/Multiple view adjustment



## Bad Points

3D Points (& supporting 2D / tracks) can have error metrics calculate how good/bad they are based on relative error metrics in a population of points
the population could be: 2D neighborhood, 3D neighborhood, globally, single-view, pairwise, etc.
Assuming some distribution, the worst points (via a given metric) can be marked as such (or removed, etc) and no longer used in subsequent steps
However, points that may have started out with very high error (eg 4+ sigma) can have their error in a given category reduced as transform refinement progresses
Points marked as 'forever bad' should only result from metrics that are unchanging, or should be added back if the metric changes
eg: the NCC of 2D images doesn't change as the image is constant no matter what
eg: reprojection error of a point can change significantly if the 3D estimate changes based on moving a view around.


## Local Minima

Not all possible values of variables (eg rot & tra) can be tried. Therefore best guess next or subset of values can only be tried.
Minmally there is 1 value in variable space to use (existing or predicted next best).
'neighborhood' values can be tried as well, but the number grows exp. with the number of variables, and the cost fxns can be slow.
	- randomly
	- lattice/grid 
If local errors or known discrepancies can be found, the search space can be minimized

## Solution Averaging

Given 2 possible solutions, an optimal solution might lay inbetween these values, trying some discrete set might uncover better options / limits


## Solution Trajectories

Previous & Next best guesses at solutions (or similar lower-level problem solving steps) can be used to define a 'trajectory' in the solution space
with 2 points, this is a linear interpretable line segment over each separable variable
with several samples of a solution, more complicated curves may be 
due to the completexity of the solution space, the variables are likely not very seperable
a future solution can be guessed by learning from the progression of previous solutions
	- decellerating?
	- momentum?
turn each separate value into an Nth degree polynomial and project the value from N points to the N+1 point
using the polynomial & cost values, guess the value where the cost reaches a minimum (must be at least x^2 poly)
limits likely have to be taken into account

The jacobian is sort of already doing this work tho?


## Variable choices

A view point has a transform with 6 DoF: rx,ry,rz, tx,ty,tz
Operating on fewer variables at a time might help make the problem more tractable and/or quicker
The downside of using fewer vars is that often they are not seperable and minimize in different spaces, and only reach different local minima

Some options:
	- tx, ty, tz, rx, ry, rz
	- tx, ty, tz (x)
	- rx, ry, rz (x)
	- direction along a line segment
	- ...

## Combining error metrics

Simulaneously, it is hard to combine metrics, as the error in radians is not really comperable to error in translation
these values can be more comparable if eg:
radian error is converted into an eg: sigma from a population
relative errors or improvements or etc. 

Error metrics can be used sequentially by optimizing for one error at a time
The direction in which they move the solution space might not be aligned exactly and optimizing one might actually make the other worse

Best to use an error metrics that under-the-hood incorporate each other's goals / overlap, and encapsulate as much of the problem as possible

EX: rotating a camera vs translating a camera may fight each other when performing separately, say with the same reprojection error minimizing goal


## Best neighbor candidate for comparing surfaces

Using a nearest 3D neighborhood is meaningless if the model is already assumed to be unaligned
nearbyness in 3D by using 2D projected neighbors help
points in 2D could still not be actual neighbors in 3D because of discontinuities, etc.
use 2D neighborhood as a starting point, but also filter on other metrics to make sure it is a good 3D neighbor candidate
back-project 2D points to 3D surface to get best surface location (thru 2 views is this still good?, does 2 views even make sense if the 3rd view is an unknown projection?)


## Definitions of Geometries & Error

- 2 single 3D points & getting point distance (d, d^2, d^0.5)
	- likely always some fundamental noise error
- 3D point to surface error
	- approx surface with plane
- surface to surface error
	- how to compare?
- surface normal direction error []
	- simpler metric
	- ignore basic offset errors
		- might be beneficial
	- drops some higher-level accounting?
		- might be beneficial
	- 0 normal error could exist with a large translational offset
		- bad

# track matches vs neighbor matches vs guessed matches

A track in A-B-C means that the 3D point exists in all 3 2D locations, it is therefore perfect candidate for 3D distance matching
However, tracks are a much more rare commodity, and do not allow for comparing pairs that have yet to go thru track processing

A 2D neighbor match in A-B & B-C are ~nearby surfaces, but aren't directly comparable do to this offset
The local surface in A-B and/or B-C can be approximated (eg plane or bi-variate surface)
the distance between the 3D point AB and surface BC can be found for the error metric
(the opposite projection should also be done for symmetry)

A 2D neighbor for AB in BC can use the 2D point AB in B back-projected to the surface BC & get a 3D distance error metric
This discounts nonlinear artifacts


## Discarding / Gathering more points


Points may be discarded (repeatidly/forever) based on error measurements.
To compensate, more points could be included/gathered to 
This algorithm assumes enough (good) points that including image data should not be necessary, focusing on 1 specific goal



## ALGORITHM CONCLUSION / SUMMARY / STARTING POINT

=> use sequential view-adding
=> don't throw away points, but discard per iteration based on error metrics
=> INVESTIGATE LOCAL SOLUTION SPACE CHECKS use error ranges to try neighborhood searches around best guess
=> INVESTIGATE TRAJECTORIES?
=> INVESTIGATE SOLUTION AVERAGING?
=> 6DoF seems best bet, sadly
=> INVESTIGATE: minimizing on single error metric is maybe best? - choose whichever candidate seems best performant, could see if secondary iterations help or make worse
=> use 2D neighborhood, but need to search & discard bad candidates (eg discontinuities)
=> use planar-estimated surface distance metrics
=> focus only on moving points around (getting error down), not gathering more points





## ALGORITHM

Given: A bunch of matching points in AB, and separate matching points in BC, eg: 1k~10k [up to ~100k]
Goal: Move camera C around to get points (surfaces) to overlap as much as possible to look like a single 3D reconstruction


Iterate over a loop until error is minimized or reach maximum number of steps

 PREPARE PAIR POINTS (AB & BC):
	- drop points in AB based on error metrics:
		- 3D reprojection?
		- 3D surface distance error (if this has been calculated yet)
			- or angle if that is what is being used?
			- or both?
		(any other data that comes along?)
	- get neighborhood 3D distance distribution (8-10 2D points)
	- drop points where the neighbors have a wide range in distance (remove points near discontinuities)
	- drop points based on other criteria?

valid points are the remaining points after outliers have been removed for one of various reasons

ERROR FXN:
	- for each valid point pair in AB:
		- approximate surface at AB (for AB this only needs to be done once, for BC this needs to be done every time because C moves)
			- find 5~8 nieghbors
			- estimate plane (normal & point average)

	for each valid pair in AB
		find closest 2D neighbor
			- get error: 3D point AB -to- 3D surface BC
			- get error: 3D point BC -to- 3D surface AB
			- error(distance) = errorAB + errorBC
			- error(direction) = angle(normalAB & normalBC)
on update-> or is each call needed to redo point-preparation





Approximating surface at AB:
	- 





A VERY VERY LAST STEP COULD BE TO JUST ALIGN THE SURFACE POINTS
	- linearly move entire set of points toward existing
	- nonlinearly just push one towards existing status-quo?
		- locally / best guess push?
	- cameras/views would not be involved, only the points
		- only used to help the final mesh generation & textures sampling
			- might the texture sampling get worse?




AS A SEPARATE INVESTIGATION:
- hows do the results of this comare:
	- moving the points BC toward surface AB and THEN re-estimating the camera C location (using the linear approach)
	- possibly also followed by nonlinear & iteritive estimations?






