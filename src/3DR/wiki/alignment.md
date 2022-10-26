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






...
