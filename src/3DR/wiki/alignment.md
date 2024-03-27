# 3D point / camera alignment


- N views in approximate location/oriention to each other
	- order of 0-10 degrees rotational error [X,Y,Z]
	- order of 0-10% baseline distance translational error

- goal: align all views / view-pairs so the 3D points align (minimize bluring)


## error metrics:
	- single reprojection error
	- pair reprojection error
	- triple reprojection error
	- 2 separate pair 3D point geometrical error
	- expected AB: A-C & B-C expected location


### Move single view to be in oriention minimizing single-transform 2D point reprojection error


### Move single view to be in oriention minimizing single transform 3D point distances
???


### Move single view in the 6D direction (gradient) most directly toward goal 3D points
- get 'gradient' direction from current A-C & B-C points towards desired A-B points
???


### Move single view to be in oriention minimizing or averaging predicted A-C & B-C location from A-B as base view pair
???


### Move single view to be in oriention by inverting estimated average 3D transfrom between coincident 3D points
	- this is actual a movement of a view PAIR





- there might be problems of local minimums that stop the search -> not necessarily a path from current guess to optimum guess
	-> can use a local area exhaustive check?
		- finite range
		- binary search
	-> way to 'blurr' cost function to smooth out search to limit minima count?
	-> way to combine different methods together to jump around using different error/cost metrics?
	-> ways to iterate on a given method to progressively improve estimation?
	-> use a 'trajectory' to estimate the final values (rx,ry,rz, tx,ty,tz) w/o needing to calculate the various iterations ?
		- follow a path & predict the future location based on previous vector directions
			- need 3+ estimates? the value changes need to be decreasing




- don't want to move C 'toward AB' => want to move C toward some objective truth of AB



- to get ballpark transform distance check:
	- average / sigma 3D point distance?
	- average transform bringing points into alignment -> get origin translation
- way to get ballpark transform rotation check:
	- Z(X,Y?): what the angle is that corresponds to the translational point distance @ camera distance to points
		-> worst-case-triangle angle
	- average transform bringing points into alignment -> get rotational component (X,Y,Z) -> quaternion angle / 2 ?


- orientatron



- minimize C geometrical error to AB [AB points are truth, BC & AC || ABC are errors]
- minimize C 3D->2D reprojection error [ABC points are truth]
...
- minimize B geometrical error to AC
- minimize B 3D->2D reprojection error
...
- minimize A geometrical error to BC
- minimize A 3D->2D reprojection error
... 
REPEAT



### TODO NEXT STEP LIST

- make exhaustive & binary search checks w/ cost fxn:
	- (square?) distance error between 3D points (AB & AC) (AB & BC)
	=> see if this search approaches the correct value ?







# Alignment Algorithms


- global all-at once
- single iteritive progression


## Align point geometry 'surfaces' points

- Steps:
	- get overall vector/rotation (transform) between point sets: AB, AC, AB
	- move points in AC & AB toward AB to minimize difference
- Positives:
	- surfaces alignment
- Negatives:
	- recalcuate camera locations
		-> lose all nonlinear adjustments
	- which points are "correct"?
		- hold some points/camera as constant, only move other cameras?
		- use a 50/50 average?
		- use reprojection error as weights?
QUESTIONS:
	- can a 'linear' 3D transform be found, and tested at 0->1 @ various points to find where error is minimized?
		- (the camera would be moved along this transform: translation + quaternion)
			- can you get a % turn of quaternion?
		- what error metric to use?
			- reprojection error?
			- 


## Align point geometry 'surfaces' via camera orientation update

- Steps:
	- hold camera A in position
	- move camaras B,C, ... in a gradient descent way that minimizes error
- Positives:
	- nonlinear steps
	- camera location is source of truth
- Negatives:
	- very noisy error
QUESTIONS:
	- what error should be minimized over?
		- average surface distance error?
		- 



## Align camera w/ 3D reprojection error

- Steps:
	- SAME AS PREV, USING REPRO ERROR
- Positives:
	- 
- Negatives:
	- local minimum prevents movement to optimum?




## .

- Steps:
	- 
- Positives:
	- 
- Negatives:
	- 




## .

- Steps:
	- 
- Positives:
	- 
- Negatives:
	- 






## .

- Steps:
	- 
- Positives:
	- 
- Negatives:
	- 






NOTES:
	- no single camera or camera-pair should be treated as source of truth
		- any algorithm with a single camera as truth should be repeated (randomly) using all other cameras in iteration



Plot3DCameraError





# ALIGNMENT THOUGHTS

## GOAL:
- separate pairs of view reconstructions need to be aligned together in a global sense
	- sequentially: add a view / view-pair at a time
	- all at once: from initial global estimate align all views / view-pairs at the same time


## PROBLEMS:
- in practice the view orientations don't converge
	- all the points blurr
	- the views move around

## CAUSES?:
- the optimization criteria is very noisy with many local minima
- 



### sub-problem definition
- given:
	- accurate pair of points AB
	- accurate pair of points BC
	- rough orientations of cameras & rough orientations of points in 3D world 
- goal:
	- move surfaces (points) to an orientation where they overlap best
- limitations:
	- can't move the points directly, can only move cameras
	- camera movement has nonlinear relationship with point movement
		- translation is roughly the same
		- cant separate/decide if a translation or rotation or combination is best
	- moving a camera I may affect where another 'static' point J is
	- in a large group of already globally aligned views: moving a subset of views at a time may make other view relationships worse?????
	- local minima might prevent
		- try 'wider' searches with somewhat-exhaustive checks


### sub-problem possible algorithm A:
- keep stationary camera A
- keep relative transformation B-C
	- camera pair BC move as a unit
		- points BC are therefore also always constantly positioned relative

### sub-problem possible algorithm B:
- keep stationary everything except camera A


- points AB may move around (nonlinearly)

- want to move points in BC towards points in AB
	- again: points AB may move as BC moves



- get an average overall (average) (error) vector between points BC and points AB
	- want to reduce / minimize the total length of this surface distance error

- for every change, is the error better or worse
	- need to recalculate the points AB
	- need to calculate the errors: d(AB, BC)




- start with a very tiny number for 6 DoF to change

A)
	- move tx,ty,tz, rx,ry,rz all independently starting with small numbers
		- don't want to overshoot ?
B) 
	- vary 6DoF all together & gradient descent



- separate errors in rotation & errors in translation ?



- error functions:
	- point-to-point:
		- distance
		- d^2
		-> outliers might have a bigger say
	- 2-point pair: direction can get a rotation error metric
		- angle - error
		- dot-product error (assuming unit length)
		- 'size' / length error [ratio of large/small - 1.0]
	- 3-point pair: get a normal direction - similar rotation error metric
		- 

- drop pairs with large error metric outside distribution


=> test this algorithm out in 2D:
	- set of points with only tx,ty,r 




- for changes in camera rotation or location, nonlinear changes accompany the rotations and locations of scenery 
	- rotation & translation of camera aren't separable
		-> need to combine the rotation and translation error together into some total error
		-> or iteritevely alternate between rotation & translation error metrics seperately
		- MIGHT be fairly seperatble tho?






"edge cost"
"free space cost"




PROCESS FOCUS GUIDES:
	- combine exhaustive (local-ish search)
	- with gradient decent (keep-going along local optimum trajectory)
		=> need to find 'scale' to use
			-> on range of ERROR ?
	- separate rotation & translation errors
	- 


- for ~3 views (2-3 pairs): 1 pair can be held constant while others iterate
	- might help move out of local minima

- for N views (>>3):
	- all pairs are fairly stuck in place
		- moving a single camera toward a better place in one camera might move it to a worse place wrt another

- SEQUENTIAL UPDATING
	- adding Nth view:
		- all paired point locations change as 




ITERITIVE CLOSEST POINT:
	- error = distance to closest opposite cloud point


- 3D point location may also be nonlinearly estimated => position is moved to fit:
	a) dual-projection error minimum
	b) patch projection error minimum



Code.averageAngleVector3D = function(vectors, percents, count){
Code.averageVectorTwist3D = function(twists, percents){



- 3D rotation error should be more than just angle between vectors -- this ignores the twist
- can use the twist error - which is the distance from the X + Y + Z vectors of a rotation

- how to find outliers in 3D twist?
	- error outside std dev?
	-> different transforms could also exist that happen to have same 3D error



- points that are known to be poor angle/tx/ty/distance (sigma >2~3) can be dropped from all calculations
	- repeatidly dropped from ANY of N estimations
		- if array length changes (ie a point was dropped)
			- in any of:
				- rotatton
				- tx
				- ty
				- distance

		=> then all other estimates can be further updated & outliers re-checked & dropped










ANOTHER CRITERIA TO THROW OUT OUTLIER POINTS:
	- get a couple of random point pairs in A & B for each point A & each point B
	- get total error for each of the N (5~10) samples in twist & throw out points with highest sample error





- for 3D camera error reduction:
	- only COSTS are useful, can't use transform
	- rx,ry,rz & tx,ty,tz all have influence

	ERRORS:
		- total distance: d(a,b), d2(a,b)
		- dx(a,b)
		- dy(a,b)
		- dz(a,b)
		- single-vector distance
			GIVEN 2 POINTS:
				- have a 2D rotation (& perpendicular axis) 
				- angle(a1,b1)
		- rotation-axis distance
			GIVEN 3 POINTS:
				- form triangle ABC w/ normal AB x BC @ CoM
				- 1D error: angle of NORMAL direction (missing twist)
				- 3D error: 
					- angle(x-axis) + angle(y-axis) + angle(z-axis)
					- squared error
				- 




- do area-search gradient descent function
	Code.gradientDescentNeighborhood
	- can an 'optimum' next search location be determined ?

	- how to get neighborhood size



HOW DO THINGS LOOK IF THE POINTS ARE MOVED VIA A TRANSFORM & CAMERA POSITION IS RE-ESTIMATED?



OPTIMIZING CAMERA PARAMETERS BY MINIMIZING ERROR METHOD A ..................................................................

- finding optimal set of points to work on is key
	- dropping outliers
	- end up with ~10-100 working points






- translation order of magnitude:
	- sample pairwise distances (in all other camera pairs)
	- get average distance, repeated throwing out outliers
- rotation order of magnitude:
	- sample pairwise 3-point-triangles (in all other camera pairs)
	- get average 3-angle, repeated throwing out outliers

- start iteritive search:
	- grid cound ~ 5
	- grid size scaler ~ 0.5 - 0.75
	- gradient size scaler ~ 0.5-0.75
	- tx,ty,tz neighborhood size = 1/2 average order of magnitude translation
	- rx,ry,rz neighborhood size = 1/2 average order of magnitude rotation
	- get cost for each grid point:
		- N=3 => 6^3 = 216 | 3^6 = 729
		- N=5 = 6^5 = 7776 | 5^6 = 15625

	- pick best point on grid
	- scale grid down [if grid point is better than previous cost?]

	- gradient descent pick:
		- count = 6 x 3 = 18
		- scale gradient scaler down
			- [if grid point is better than previous cost?]


	- COST A - ROTATION (LOCAL ALIGNMENT):
		- 
	- COST B - TRANSLATION:
		- 


............................................................................................................................



- try different metrics to refine triples / additional views

- sparse pairwise to get a relative R & sparse tracks

- sparse triples:
	- get relative scales
	- NO REFINEMENT

- get initial absolute view orientation / connectivity

- dense pairwise:
	- to get good Rs & many tracks

- triples:
	- get relative scales
	- refine relative transforms <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

- get better absolute view orientations
	- STILL NEEDS ADJUSTMENTS


NEXT STEPS:
	A) combine all views into single global space
		- 
	B) refine view orientations - improve with more than 3 views at a time?
		- means possible new scales
	C) increase point counts
		- density for surfacing
	D) 


WHAT ABOUT THE WHOLE SKELETON PROCESS ?????
	-> iteritive refine tracks for skeleton

	- totally separate pair points:

		- 2D reprojection error [start with this to get views more aligned]

		- SINGLE POINT DISTANCE: closest non-view point in 2D -> (3D distance error minimizing)
			- or do 2-3 OR NEIGHBORHOOD (eg: 3-5) averaging to help cancel noise?
		- 3D NORMAL (1D ANGLE): - find overlapping 2D triangles -> compare normals in 3D space (1D rotation error minimizing)
			- 3-closest non view points + 2 closest view points
			- 'closest' points have a lot more error than 'nearish'
		- 3D ROTATION?: 
			- back-project 3 triangle & COM points from view onto plane for non-view triangle
			- error = angle between each of the A/B/C points wrt center point
				could include normal vector angle error too?
			
	- shared points - tracks have to be merged



- bundle: [groups of 4-8]
	- iteritively add views?
	- refine Rs
	- get dense points

- global view orienting
	- iteritively add a view
	- 

- global point positioning
	- iterive object surface match
	- view locations is assumed rigid transform with use points

- surfacing

- texturing

- rendering


. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 

# P1 - finding world 

## LARGE DATABASE MATCH FINDING

- Use progressively more complicated/involved metrics to find potentially matching images
	- coarse color histogram [1000+]
	- high-resolution color histogram [100-1000]
	- coarse feature matching [10-100]
	- feature matching [~10]


## SPARSE MATCHING

- Find initial pairwise view orientations [up to 5-10 pairs per view]
- Find good set of tracks to allow for later triple sets [~100-1k]
- Use steps to progressively discover scene properties & increase fidelity
	- initial coarse feature matching
	- F initial estimation
	- F refinement (finding supporting features)
	- R initial estimation
	- R refinement
	- patch/point increase density (expanding neighbors)
	- point filter to get only best tracks


## TRIPLE RELATIVE SCALE ESTIMATION

- Combine pairs A-B | A-C | B-C to see if a relative scale can be determined
	- sample point-pairs in space & see what average scale seems to be
? REFINE RELATIVE VIEW MATRICES
? FIND MORE / BETTER TRACKS

## GLOBAL ORIENTATION ESTIMATION (LOW FIDELITY)

- Find absolute orientation of all views
	- Combine all known pairwise Rs, relative triple scales
- Find possible putative pairwise matches using estimated orientation graph

## DENSE MATCHING

- Focused on fewer/more-likely successful putative pairwise matches [~5 per view]
- Find Refined pairwise R
- Find dense set of tracks


## TRIPLE REFINEMENT & RELATIVE SCALE ESTIMATION

- Combine pairs A-B | A-C | B-C to get relative scale
? REFINE RELATIVE VIEW MATRICES
? FIND MORE / BETTER TRACKS


## GLOBAL ORIENTATION ESTIMATION (HIGH FIDELITY)

- Find absolute orientation of all views
	- Combine all known pairwise Rs, relative triple scales
- Segment into bundles (groups of ~5 views) that can be worked on in chunks


## BUNDLE DENSE MATCHING

- Find dense track point matches [3+ view support]
- Refine view positions
	- Iteritively add views to get best orientation estimation [4~6 views at a time]
		- 2-3 overlapping views in a group

## GLOBAL ITERITIVE VIEW COMBINING

- Find absolute orientation of all views using bundle group data
- Iteritively add single view at a time,
	- using only tracks from: primary-view & 3~4 (EXISTING) adjacent neighbors in memory

## GLOBAL POINT COMBINING

- Combine separate point groups from global view refinement
	- Load in chunks of memory at a time
	- Use in-storage OctTree to isolate working set


# P2 - generating world

## SURFACE RECONSTRUCTION

- Generate triangles from dense point cloud

## SURFACE TEXTURING

- Color triangles using view orientation projection

## WORLD RENDERING

- Render world in novel perspectives







- GLOBAL ADJUST DOESN'T SEEM LIKE A POSSIBLE ROUTE


















...
