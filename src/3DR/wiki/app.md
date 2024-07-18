# App Experience / Capabilities

[ | moments | momento | yao | chumbee]

### MVP:
- calibrate camera
- import picture set
- run (low res) modeling
- view (low res) model locally
- save multiple (limited) models
- create picture of scene [basic 1920:1080 / panorama]
...
- view example / feature projects
- offload processing jobs to cloud [centralized code to prevent skews]
- share models [privately / publicly]
	- read/edit access

### Extended:

#### share model
	- save preview image & model resources on server
	- accessible via random hash
	=> moderation?

#### export to 3D-view scene (oculus, cardboard, ...) [+1]

#### add audio to scene [+1]

#### create video of scene [+1]

#### save unlimited models locally [+1]

#### export as filetype:
- PLY
- STL
- FBX
- DAE / ZAE
- VR/AR asset thing?

#### export texture map (+ model) [+1]

#### medium resolution [+1]

#### high resolution [+2]

#### community interaction (comment, like, sharing)


- adding features should have free try before buy
	- A) do it a maximum number of times ever (10)
	- B) do it a max number of times per n (24) hours
	- C)


### Screens:

#### main menu
	- browse shared projects [see other's models/images]
	- browse MY existing projects
	- new project

#### project browser
	- summarized with pictures / name / created / modified
		- source images
		- exported model screen capture
		- large model picture in BG [or slowly animating low-poly version]

#### project
	- add image [file browse from documents]
	- remove images
	- edit usable image area [masking out areas not to be used for: point matching / calculations]
	- calibrate camera settings [pick one of pre-existing cameras or do calibration]
	- execute/calculate [perform 3d reconstruction processes] -- iterative: only do necessary update calculations
		- show progress / status?
			- image pairing/matching [sparse, dense]
			- 3d point projection [colored cloud]
			- texturing
	- view model
	-
#### model viewer
	- 3d orientable/navigating
	- change camera settings [multiple cameras / views]
	- take picture [create novel perspective image]
	- edit model polygons
	- share model
	- export
		- model
		- texture
	- apply filter (texture) [sephia, grayscale, solarize, smooth, invert, ...]
	- background color/image
	- view snapshots / vantages
	- share
#### image importer
	- images
	- video components [may need a separate camera calibration]
		- time-scale grabber
#### image editor
	- brush size
	- add / remove toggle mode

#### create account
	- username/email
	- ALSO handle after-the-fact user account creation
		- connect an auto-generated account with known one

#### sharing settings
	- project sharing
	- reconstruction sharing
	- deep link to sharing page
		- specific sharing settings?
		- who get's final say
	app://scene/SCENE_ID/

### PITCHING
	- you're outside alone in a park, meditating, hiking, enjoying yourself, you think to yourself this would be a nice experience to relive later, or share with someone who couldn't make it
		- you take a dozen snapshots of the scene around you
		- you record 30 seconds of ambient audio of the area
		- you upload these to a new project in the app
		- next week you show your friend (via screen-view or cardboard) and they feel as if they were there

	- you're walking around a neighborhood, you become intrigued by a new kind of flower you've not seen before, but can't appreciate it as much because its so small
		- you take 6 photos, upload to the app
		- you zoom in to see the detail
		- you share a zoomed-in photo on the instagram

	- you're on vacation and you see one of the world wonders
		- there's tons of people in the way preventing you from getting a great shot
		- you take a dozen shots from various less-optimal angles/locations
		- the app allows you to see the wonder from a position you wouldn't be able to in the real world

	- you want to make a 3D print of something you see on the shelf
		- you take several photos of the object
		- you export to a 3d-file format
		- you print on your makerbot

	- you're a 3D modeler and there's a real-world scene you'd like to include in a new video you're making
		- you take dozens of pictures of the scene
		- you select some of the items you want removed from the scene, or scaled differently
		- you export the scene into a 3D studio file
		- you jumped ahead to a starting place for your video project

	- you're thinking of painting some walls in your house
		- you take a few photos of the room
		- you choose a filter to color part of the scene something else (or draw on it)
		- you send the picture to your friend to see if she agrees.

	- you're a museum historian and want to make public heritage artifacts available
		- you set up your artifact
		- take several photos from various angles
		- you put the model up on the museum website

	- you're a 3D printing geek
		- you want to create a fix for a part (eg fridge foot, ...)
		- you put the model in the printer
		- you fix your broken appliance

	- social sharing

	- measure something?

	- artistic redesign / filter the world

	- export to oculus



### PRESENTATION
	- I went on a trip to chichinitza a few years ago and took some pictures of some features i liked
		- i can upload from my phone or on my vr magnopus scenes app
		- i can quickly generate a texture mesh with only a few images
		- i also recorded some audio / video listening to a subject matter expert emmerse me in the
			- drop it in the scene
		- there were a lot of people there but because they were moving around the algorithm is able to remove them from the enviroment
		- it was daytime but I'd like to add some filters to make it look like nighttime
		- or maybe i want to make it seem comic-booky with a spiderverse filter
		- I publish my scene with a geotag for a real-world locaiton [it is picked up by a curation team and made available to everyone]
		- i can then share the space my friends or other random people can go in and copy the space and do with it what they want

	- I'm painting my room but i want to get a real feel for what a good color would be
		- using some pictures of my room i generate the scene, look at it in vr
		- i do some simple selection editing and apply some tinting
		- i can see what it might look like in a bright day or a dark night
		- i find my favorite color and paint the room
	
	- I'm a 3D printer geek and i want to print a replacement piece for something that broke
	- I'm a 3D modeler and i want to get a quick start on a 3D scene from reality
	- I see a really cool flower and I take some pictures, generate the world, scale it up, and look at it from the perspective of a bug




### data structures
- project
	- views[]
	- view pairings[]
	- points3d[]
	- surface model mesh (OUTPUT)
	- cameras[]
	- interactive experience
		- cameras[]
		- background

- camera
	- calibration

- view
	- source image
	- features [point, size, angle]
	- masking image
	- camera ref

- pairing (matching)
	- view A ref
	- view B ref
	- forward transform (A to B)
	- matched A points2d[]
	- matched B points2d[]
	- points3D[] ref

- point2D
	- point in image
	- point3D is attached to ref

- point3D
	- point in 3D space
	- points2d[]

- mesh
	- triangles3d[]
	- textures[]

- triangle3d
	- texture ref
	- coords3D[]
	- coords2D[]






storage / memory info

project typical numbers:
	10~100  number of images
		each image has ~ 0.2 other matched images
	~N*N(0.2) pairs [ (n.(n-1))/2 - 2 pairs possible ]		CURRENT GUESS OF AVERAGE GRAPH CONNECTIVITY
	~N*N(0.1) triples [(n)*(n-1)*(n-2)/6 triples possible] - tetrahedral number

	20~200 pairs -- blind pairs will be high, dense pairs capped at ~ 10N
	10~100 triples -- sparse triples will be medium, dense triples capped at ~ 6N
	tesselation ~ 1/10th original dense points

	[max 4032 x 3024]
	2016x1512 image @ hi res [triangles]
	1920x1080 image @ med res
	960x540 image @ lo res [BA]
	500x375 working res [features]

	1.2192768E7 pixels @ high res
	2.073600E6 pixels @ med res
	5.18400E5 pixels @ lo res

	100~1000 initial features
	50~100 matched pair features
	1k-10k matched sparse points
	0.5k-1k tracks per sparse pair
	10k~50k matched dense points
	1k~10k tracks per dense pair
	2-5 avg track length CURRENT GUESS OF AVG TRACK LENGTH
		SMALL LISTS:
			- 2 @ 80%
			- 3 @ 15%
			- 4 @  5%
			- 5+ @ 1%
		LARGE LISTS:
			- 2 @ 50%
			- 3 @ 25%
			- 4 @ 12%
			- 5+ @ 6%
	100-1k * N sparse track points total
	1k-10k * N dense track points total
	50k * N 2D dense points total
	50k * N/3 3D dense points total
	10k triangles per view
	10 images: [10-45-120]
		20 pairs
		60 triples
		1E4 sparse track points [10,000]
		1E5 dense track points [100,000]
		5E5 dense points [500,000]
		1E5 triangles [100,000]
	100 images: [100-4950-162k]
		1000 pairs
		600 triples
		1E5 sparse track points [100,000]
		1E6 dense track points [1,000,000]
		5E6 dense points [5,000,000]
		1E5 triangles [1,000,000]
	10 images:
		0.25 redundant coverage
		50E3 dense points
		= 125,000 dense points total
		px3 + nx3 + (v,x,y)x3 = 15 floats per point
		= 2,000,000 x 8 bytes = 15MB
	100 images
		0.25 redundant
		= 1,250,000 dense points
		= 1,250,000 = 150MB

image resolution: 2000 x 1500 = 3E6 pixels
point size ~ 1/10 = 200 x 150 = 3E4 points
redundancy ~ 33% = 1E4 unique points
100 pictures x 1E4 points = 1E6 points



20-50k for dense pair
group of 6 dense stereopsis: 25k x 6 = 150k points per group
~ 100 / 6  ~  20 groups @ 150k  ~ 3E6 points total


CELL / DENSITY FOR IMAGES:
- typical image: 1080x1920 = 2073600 ~ 2E6 pixels
- sparse density: ~ 21x21 pixels = ~ 1% [51x91]   LO: [36x20 ~ ?] HI: [72x40 ~ 26]		~ 2880 pix 		3E3
- dense density: ~ 11x11 pixels = ~ 0.5%                          HI: [143x80 ~ 13]		~ 11440 pix 	12E3
- ba density (add back): ~ 3x3-7x7 pixels = ~ 0.25                HI: [214x120 ~ 8]		~ 25680 pix 	25E3


-- final cell / pixel resolution also depends on the image being loaded at the time of transform



CURRENT RUNTIMES:
features ~ 20 seconds
sparse pairs ~ 1 minute
sparse track BA ~ 10 minutes
dense pairs ~ 10 minutes
dense track BA ~ (20?) minutes
group stereopsis ~ (30?) minutes
triangulation ~ (10?) minutes
texturing ~ (10?) minutes




# EXAMPLE USAGE:
- import camera calibration/registration images
- calculate camera calibration
- import all source images
- ? create mask images @ source resolution for undesired areas (eg people / variates) => this should maybe be automatic
- create feature locations & descriptions for each images
- n*n image source image matching (pairing) [higher res]
- ~n*log(n) image pair initial reconstruction / relative camera orientating (lower to higher res iterating too -- divide cell size until cells ~3)
- initial global camera absolute orientating
- BA+Track Expanding + point expanding camera absolute optimizing (multi-view point following)
- final global BA => 3D absolute point generation (structure) & camera geometry (motion)
- ? bundle/adjust to refine 3d coordinate positions
- 3d surface triangulation
- triangle texture mapping
- model viewing









google app engine project - nodejs
https://cloud.google.com/appengine/docs/nodejs/
- hello world
- routing
- returning binary objects (eg images / data)
- doc storage DB
- sample API
- authentication
- compression
- encryption

TIMELINES:

- fix pairwise points to have low error & correctness
	- patch normals?
	- filer out poor seeds?
- fix group to keep only best points
	- resolution logic
- fix texture packer to be much more efficient
	- packer algorithm
08/01 - 360 object scene ~ 20 images
- optimize some of the algorithms
	- half time of eg: dense
	- (this will require 10-100 x speed ups)
09/01 - set of ~ 50 images	
- what to do about points at infinity

11/01 - MVP

MISSING:
- initial broad view matching - better 
	- 'icon' 21x21 blurred circle matching as part of filtering to best match set
		- A) histogram to top ~ 25
		- B) icon @ rot & sca to top ~ 10
		- C) feature match to top ~ 6
- bundle moving surface points toward eachother
	- how to estimate progress ? [R-ERROR, average surface distance error ? (wrt: ?)]

- mass-dense point aggregation via merging separate P3D files
	- logistics [2d]
	- reading chunks of a file ? (separate into 10-100MB of file?)
- hole filling
	- invisible areas
	- featureless areas
- BA identify/remove view if it's position is very bad???? [outliers]
	- inconsistent / contrary / high error
- triangle - texture loading groups at a time to get local approx blending
	- logistics [5d]
- out-of-core octtree (stereopsis focused - combining large number of points)
	- system design [10d]
- triangulation algorithm updates
	- not smooth enough
	- curvature wrong
- world-sphere projection & minimum mapping
- affine matching (& to patches) can get bad
- errors & magnitudes (eg F/R) should be in PERCENTS of image size (ratios)
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

sequentiallyOptimizeViews
var modeModelReconstruction = true;


NEXT TASK:
	- start optimizing additional views:
		- reprojection error
		- 3D surface distance error 3+ pts [projected surface point]
		- 3D surface rotation error 3+ pts [normal]
		- 3D surface distance error 1+ pts [average location]
		- 3D vector rotation error 2 pts [direction vector]


	- heat-volume of camera extrinsic param error -> visualize in octave
		- eg 3D translation 
		- eg rotation


- when to use skeleton v non-skeletion v groups?
	- is this set to skeleton for now just for debugging purposes
	- skeleton group needs to be broken up too for 

































- visualize the error metrics in the volume of camera movement
	- average reprojection error
	- average surface-distance error
	- average squared-surface distance error


=> DIFFERENCE BETWEEN ACTUAL KNOWN GROUND TRUTH  v  ERROR MINIMIZED BEST POINT
	- location on x/y/z
	- rotation quaternion values? x/y/z rotations ?


- 2D camera estimate from matches???
- linear & nonlinear


- see what estimating camera linearly from points gets





SOME RELATIONSHIP BETWEEN POINT TRANSFORMING (metric/euclidean) & VIEW/CAMERA ABSOLUTE TRANSFORMING
	=> don't want to use some R-re-estimation
	=> do want to use some geometric moving constraint

		=> projective points fixed on a plane
			=> where is this plane ?


=> 2D linear estimation isn't doing well with some projections
=> try progressive:
	- translate
	- scale
	- rotate
	-> repeat


- try synthetic geometry matching

A) just the geometry
B) with view projection
	- 2D & 3D



=> understand how the P3D DLT is only an approx & how to nonlinearly make it better & what that means




TO ALIGN GEOMETRY:
	- linear step to put geometry close
	=> set the camera to a new position
	- how to calculate a % of a transform
	(linear position)
	(linear angle [2D] -> minAngle direction)
	(linear quaternion [3D])



GUESS A)
	- find linear estimation to map geometry
	- binary intersect on [0,1] of transform
		- placing camera at interpolated orientation
		- error = distance between goal & subject points
			- GOAL:
				- A: transformed SUBJECT points
				- B: existing GOAL points
	- nonlinear step to update camera extrinsic to minimize distance error




- full actual sequential method process



solveSequentialView


-> MAYBE the discrepancy needs to be focues on lining up frames and not minimizing reprojection error:
	-> IE: move & rotate the camera to get the separate pairwise-points to line up in 3D

	-> want to minimize the distance between the point neighborhoods

	A) udpate camera translation & rotation iteritively in direction that minimizes the error
	B) set the points to the new positions & derive what the camera translation & rotation should be
		=> how to get camera matrix from known 2d/3d points ?

		https://www.cs.cmu.edu/~16385/s17/Slides/11.3_Pose_Estimation.pdf
		- pose estimation
			-> SVD for 3 rows of matrix
			P = K[R|t]

		https://www.uio.no/studier/emner/matnat/its/nedlagte-emner/UNIK4690/v16/forelesninger/lecture_5_2_pose_from_known_3d_points.pdf
			Pose from known 3D points
			– Decomposition of P matrix
			– PnP
			P3P


	- need to keep all of the pairwise points separate initially to keep sets independent
	- need to get the distribution of the population and discard high-error outliers

	-> after the points are aligned, then combining can begin

https://courses.cs.washington.edu/courses/cse577/11au/notes/Z12.pdf
MESH ALIGNMENT PROBLEM:
	- iteritive closest point
	- 
	- Procrustes



MAKE TEST APP TO VISUALIZE:
	x views/cameras
		- use 2+ example images
	- perfect 3D & 2D locations
	- gaussian error 2D locations
	- 3D linearized location
	- midpoint
	- rays to various 3D locations
	- 3D nonliner estimated location
	- what the image features look like
	=> SYNTHETIC IMAGES
	=> REAL IMAGES

=> - visualize the points & projections & ... in 3D to understand
	- midpoint
	- exact Ax=b
	- linear least squares SVD
	- 'optimal' 6 degree polynomial
	- nonlinear?:
		- move P3D to minimize geometric reprojection squared distances
		- move P3D to minimize 2D image projection visual comparison (NCC, SAD, diff)
=>


=> visually display what hierarchical 'min resolution' cells look like (starting at some subdivision count)
	- cornerness - avg, max
	- range rgb - avg, max
=> nearest neighbor 'cell size'

-> how to get all adjacent NEIGHBORS in a non-uniform hierarchy?
	- is uniform cells still OK?



=> what does it mean to be a neighbor, what context does it matter?
	=> expanding in 2D
		- 
	=> knowing how close an intersection is

=> cell size is not necessarily / exactly resolution dependent - tho highly correlated




- if first views are 'certain' of absolute position -> then 3D point 'HAS TO' lay along the ray thru the image
	=> does the DLT already put the point along this line ? [with 2 views]
	=> why isn't the DLT exact? what is the error?
		(2D point location )
?
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
RE-EVALUATE STEPS TO GET LAST COMBINED VIEWS WORKING:
INPUT:
	- views in near-correct absolute positions
OUTPUT:
	- 3D points in correct absolute positions




- points that are far away from their goal OR their counterparts are bad


- discard points that are very isolated (kNN is very large ?)




**********************simulate getting 2 cameras (in 3 images) aligned from separate frames of reference

**********************can a 3D transform from points be applied to the camera ?
	current points locations to another frame's point locations:
		- average translation
		- average plane of rotations
			-> average angle about normal direction

		- start with some central view/pair & extend outward

		- 













FiniteElementCameraGeometricDistance

FiniteElementCameraExtrinsicSingle

Code.discreteSubdivision

Code.optimizerBinarySearch

testMatchViewGeometry3D

















solveOptimizeSequential




=> connected graph: sequential/graph.yaml -> did not have enough connectivity to include all images


=> what are the pairs used ?
	=> are the point matches good?
	=> are the track matches good?


- for structure optimizing on point location differences:
	=> add outlier (3D distance sigma dropping)




=> don't want the optimization on geometry to be equal to a STATIC point, but to an AVERAGE of N reprojected points
	=> what does optimizing on this look like ?

=> structure matching only works with a REFERENCE structure
=> simultaneous matching of all points sounds unstable?

=> sequential updating of views / structure 


=>	NEW ALG: .................................................................. iteritive sequential view matrix optimizing
	x pick transform with most connected points / per / error
	x continue to pick views in priority (this should alreay exist) --- initGraphSequential
		x prioritized on connectivity
	x organize track pairs by order views are added
	x save list of 'initial' view transforms
	REPEAT: # ITERITIVE
		x set first view @ identity
		for each remaining view: # SEQUENTIAL
			- estimate starting orientation by offsetting from currently set views [drifting: scale, rotation, location]
			x add any new pair points that come along with this view
			- optimize view via reprojection error [to get to stable orientation state]
			x remove all pair points from view
			- (if more than 2 views) optimize view via structure matching [to get point pairs to line up]
			- add all new pair points for view
		- remove all points
		- save new view transforms as initial list
	





Stereopsis.World.prototype.solveOptimizeSingleViewReprojection


TRACK [5] STARTING POINTS: 1151


groups:
	-
		views:
			- "2W6ECNGK"
			- "WB5ZRG8U"
			- "F7VU2LIQ"
			- "LJHF328H"
			- "YSV6VXF3"
		edges:
			-
				A: "F7VU2LIQ"
				B: "LJHF328H"
			-
				A: "2W6ECNGK"
				B: "WB5ZRG8U"
			-
				A: "WB5ZRG8U"
				B: "YSV6VXF3"
			-
				A: "LJHF328H"
				B: "2W6ECNGK"
		filename: "track_0.yaml"


NOT INCLUDED:
	-
		id: "2W6ECNGK-F7VU2LIQ"
		A: "F7VU2LIQ"
		B: "2W6ECNGK"
		error: 0.005773549603548021
		count: 897
	-
		id: "F7VU2LIQ-WB5ZRG8U"
		A: "WB5ZRG8U"
		B: "F7VU2LIQ"
		error: 0.0012879566242573752
		count: 1125
	-
		id: "LJHF328H-WB5ZRG8U"
		A: "LJHF328H"
		B: "WB5ZRG8U"
		error: 0.0019552429222714
		count: 1190
	-
		id: "WB5ZRG8U-YSV6VXF3"
		A: "WB5ZRG8U"
		B: "YSV6VXF3"
		error: 0.014127948430625105
		count: 1536


- incorporate an error (per pair source) when optimizing reprojection error ?
- save the pair data in tracks


_iterateSparseDenseLoaded
_iterateSparseTracks



- use dense/sparse process still
- tracks
- use graph data for track pair error values
- do we still want sequential at some point ?














- tracks F /R / .. errors seem to be too lenient ?

- transform & world errors are different ?
=> WHICH TO USE?

=> ALLOW MORE POINTS TO BECOME TRACKS

=> CORNER DROP COUNT IS REMOVING A LOT




- match & point counts different ........

connectPoint3D

initNewPointPatch3D


- point to keep track if it is embedded or not


sparse track count:
	200 @ 0.1
	38,43 @ 0.9
	72 @ 1.5
	70 @ 0.8
	69 @.3
	... half size
	107 @ 0.05
	68 @ 0.02
	106 @ 0.8
	104 @ 1.3
	109 @ 0.06
	106 @ .12

.......... NEW:
	1636 -> 244 @ 0.02


only get a small section of the image: 1k-5k points
300 - 1500

=> 200 - 500 points sounds OK

10 views = 33 sparse pairs, @ 100 each => 3.3k

10 x 3 x N, 200-500 sample




- sparse tracks can't be optimized in groups by geometry optimizing [100-500 per pair]
	=> keep the point pairs separate
	=> optimize on reprojection error

- dense tracks can somewhat use geometry optimizing [1k-2k per pair]


- WHEN IS THE CAMERA CALIBRATED?






- SUMMARY & FEATURE EXTRACTION
- ROUGH DATABASE MATCHING -> POTENTIAL PAIRS (+ERROR)
- SPARSE PAIRS -> TRACKS + COARSE VIEW PAIRS
- SPARSE BUNDLE -> COARSE ABSOLUTE ALL VIEWS [reproj]
- DENSE PAIRS -> TRACKS + DENSE PUTATIVES
- DENSE BUNDLE -> ABSOLUTE ALL GEOMETRY CONSISTENCY [reproj + geo]
	-> hoping this makes the geometry really good
- SEQUENCE -> ANOTHER ATTEMPT AT GEOMETRY CONSISTENCY
- GROUPS -> DENSE POINT CLOUDS











point/patch consistency/updates


- initial spares
	- no 3D location
	- no patch
	- affine comes from the initial match
	- affine update comes from seed point (average)
- rough sparse
	- no patch
	- affine comes from seed point (average)

- dense
	- affine from patch


- WHEN ARE THINGS CHANGED:
	- INITIAL:
		- intitial putatives are given as a result of some previous matching or point generating (at least 2D points, maybe: point3D, patch)
	- PROBE NEW POINTS:
		- patch
			- lo
				- init patch from scratch
					- sphere size projection
					- affine projection
					- normal/plane estimation
						- images
							- nonlinear normal update
					- match affine from patch

			- med
				- init patch from 2D-3D neighborhood
					- images:
						- nonlinear normal update
					- match affine from patch
			- hi
				- init patch from single source patch
				- images:
					- nonlinear normal update
		- location3D
			- lo/me/hi
				- init point from DLT
				- match affine ???????????????????????????????????
		- else
			- lo/me/hi
				- affine from neighborhood?
				- nonlinear update from image?
	- 2D POINT MERGE:
		- patch
			- lo
				-> SEE NEW
			- me
				-> SEE NEW
			- hi
				-> SEE NEW (but average from 2)
		- location3D
			- lo/me/hi
		- else
			- 
	- VIEW ORIENTATION CHANGE (LARGE)
		- patch
			- SEE NEW 
		- location3D
			- DLT
		- else
			- N/A
	- VIEW ORIENTATION CHANGE (SMALL)
		- patch
			-> update location
			-> update normal
		- else point3D
			-> update location
		- else:
			-> 



solvePairF

probe2DCellsExpandR


low/med/hi point count (density)

















		

is this bad?:
refineSelectCameraByLocalGeometryMatching3D



- local errors should include R
- global errors should include R / F / N / S
- patches should be smartly updated/initted
- first sparse naive should be able to ignore R


- SOMEWHERE AROUND 7-9 : TWO SCENES SHOWED UP




- dense optimizing steps could also be primarily geometry matching ?

=> after dense:
	Want to move geometry towards eachother
	=> load all the views (transforms)
	=> just want to move the POINTS toward eachother
		-> don't need to create new points
		-> reuse overlapping existing points

	repeat for each new view:
		- load the dense overlapping pair points [if exist?]
		- move the nearby points toward eachother
	=> nothing merges, nothing overlaps, nothing intersects, ...
		-> keep in separate 2D spaces tho for lookup


=> use dense points as seeds  (pre filter on R / F / N / S) for later steps ? (group dense?)











- move the geometry closer together geometrically
	- doesn't require images to be loaded ..
=> how to do this en masse ?




- way to move points together (via point or view optimization)?
	- move 3D points toward 2D neighbors?
		- do this at the very end & only affect points?




- what are all the update types needed?
	- P3D change 3D location
		- update patch from location change
	- a P2D changes 2D location




DIFFERENCES:
	- image  v  some images  v  no image
	- point count low (1k) med (10k) hi (100k+)
	- view orientation changes
	- brand new point vs updated point

PATCH RESPONSE TO:
	- view changes orientation significant (eg 30 degrees)
		=> completely reinit
	- view changes orientation slightly (eg 1 degree)
		=> update from visuals (what if no visuals?)
	- point3d combining - adds additional p2d
		=>
	- point2d changes location slightly (eg cell subdivision 10%-25%)
		=>
	- 












- is init affine from patch same as update affine from patch ?


- HOW SHOULD EXPAND 3D PROJECTION WORK
	- only into views w/ images loaded
- PROBE?
- BLIND?








	INCREASE VIEW & O3D ACCURACY & TRACK COUNT

	- loop to convergence:
		- initialize new 3D patches
			- linear initialize 3D patch [X,Y,Z, s, N]
				- MIDPOINT
				- DLT 
			- nonlinear update 3D position
			- nonlinear update orientation & size
		- add new patches to world:
			- 2D collision resolving
				- if points are closer than some minimum size (0.1-0.25 of cell size) => assumed to be same point
				- merged point is initialized fresh or using average of prior points
				-> re inserted to world
		- expand [points with lowest error]:
			- 2D neighborhood
				- find emtpy/ worth neighbored cells
				- use 2D offset to find best geometrically likely location in opposite image
				- add to 'new queue' 
					- HOW TO INITIALIZE?

			- 3D projection (track expansion)
				- of all image-loaded view-pairs:
					- find best projected geometric location candidate
					- add to 'new queue'
					- HOW TO INITIALIZE?
		- filter:
			- 3D average reprojection error
			- 2D N score
			- 2D S score
			- 
		- nonliner update new view location
			- 3D reprojection error minimizing
		- nonliner update new view location
			- 'surface distance' minimizing []
		- nonlinear update 3D points/patches
			- 3D reprojection error minimizing
		- nonlinear view + point location?
			- 3D reprojection error minimizing

		- increase resolution
			- divide cell/hierarchy up
			- for each 3D point:
				- P2D with best corner score (highest / average?) is base [image must already be loaded by assumptions]
				- update all other P2D locations using affine local search
		- 

	=> update: 




PIECES ..............
	- 3D point optimizing:
		- move P3D in world until reprojection error is minimized
		- initial movement & min final movement needs to be calculated geometrically for each point
			- use patch size as basis:
				- start at 0.1 patch size
				- limit at 0.01 - 0.001 patch size (or so) [1/10 to 1/100]




EVENTUALLY GET BACK TO USING 'MODES' for point & patch initializing & updating (based on point count / density)
3 STAGES:
	1) low point count: 0 - 10k
		- init & update all uniquely
	2) med count: 10k-50k
		- 
	3) hi count: 50k-500k
		- new points: average patch from 2D neighbors in N views
		- don't use image to update ?




++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++



BundleAdjustCameraExtrinsic -- ?

optimizeCameraExtrinsicDLTKnown3DK

????????????

https://3d.bk.tudelft.nl/courses/geo1016/slides/Lecture_03_Calibration.pdf


=> ALGEBRAIC SOLUTION, NOT NECESSARILY CLOSE TO A GEOMETRIC (EUCLIDEAN) SOLUTION

=> NORMALIZE POINTS ????

https://3d.bk.tudelft.nl/courses/geo1016/slides/Lecture_03_Calibration.pdf

https://github.com/cybertk/opencv/blob/master/opencv/src/opencv2/calib3d/calibration.cpp


https://www.pythonpool.com/opencv-solvepnp/


https://docs.opencv.org/3.0-beta/modules/calib3d/doc/camera_calibration_and_3d_reconstruction.html#bool%20solvePnP(InputArray%20objectPoints,%20InputArray%20imagePoints,%20InputArray%20cameraMatrix,%20InputArray%20distCoeffs,%20OutputArray%20rvec,%20OutputArray%20tvec,%20bool%20useExtrinsicGuess,%20int%20flags)





ITREITVE STEPS:
	- calculate 3D poiints
	- nonlinear optimize 3D points
	- extimate camera from 3D points

how to calculate extrinsic matrix from known 3D points ?













- how to calculate the minimum size a pixel can be given a minimum range area
	- initial largest resolution for an image, eg: 4x3
	- each cell extracts 5x5 & estimates range/sigma -> maximum 3D sphere
	- if max is reached, all children 
	- each cell divides into 4 

	-> repeat until highest resolution



- check 3D location estimation: linear & nonlinear
solveSequentialView











- are P3Ds in the global reference frame ?

initGraphSequential


- still gaps between multi-view scene points ...
	=> project / 3D tracks ?

		=> probe3DGlobal ?
		
	=> any metrics used to reduce error should be global
		-> R can be done globally
		-> F/S/N can be estimated on a pair-basis, but discarded only in global population?
	=> TFT ?
- 


- R-searching is too slow


- what about N/S range == 0 [infinite error]


	searchMatchPointsPair3D
		experimentLocationRefine



SEQUENTIAL:
	- graph
		- cameras [all cameras]
		- points [all CURRENTLY COMPLETED 3D points]
		- views [all CURRENTLY COMPLETED VIEWS]
			- id
			- transform
	- initial - putative - [initial view graph]
		- views: absolute view matrixes
		- transforms: pairwise matrixes [need: count, errorR, errorF, idA, idB]
	- sequence [sequence of views to load]
			- view id [id of view to load]
			- pairs: images/adjacent: [array of all view IDs to load - including self]


- determining view load sequence:
	- first view = best connectivity:
		- eg: SUM( edge/error )
	- incrementally add a new view to the new graph based on connectivity to edges in new graph
		- eg: SUM( edge/error )
		-> prefer views w/ more edges but weaker weights rather than fewer edges but stronger weights [want more images to load]
		- images to load:
			- A) first connection - ordered on weights
			- B) next connections - ordered on weights
			-> up to min( ~ 6 images, images in new graph + 1)






- does the camera K matrix need to be iterated on?

-> fair amount of points are in a wrong spot
	WAY WRONG: 10%
		-> intital point estimate is wrong
	somewhat off: 20%
		-> initial point estimate is off
		-> affine mapping is off

-> could add final step that after updating the patch location
	ASSUMING: better point estimate
	===> better affine estimate
	====> 

-> refining all cameras at same time does not seem to adjust the surfaces correctly


=> try doing the +1 camera at a time method?
	- use initial camera relative positions as starting point for +1 iteritive method
	- aquire points in process
	-steps:
		- start with most connected pair
			- metric: rerror/points
		- VIEW ADDITION:
			- add in new view
				- R initial = relative estimate offset averaged with current absolute location
			- load top connected views (that are also currently in the graph)
			- SEEDING:
				- choose best corner points [1k-10k per view]
				- for each other view (with top connectivity:
					- find pairs of points to add
						- F/R probe w/ low tolerance/error
				- insert all new points
				- for each other view
					- probe3D point projection
			- iterate [3-5 times]:
				- probe2D
				- probe3D
				- optimize camera location wrt others [up to top 5-10 most connected views]
				- drop higest error
			- drop worst: error F, error R, corner score for newest view
	- ...





...





- pairwise seems fine, groups / tracks seems bad
	- IS IT CURRENTLY USING PAIRS OR COMBINING VIA TRACKS?
	- is only pairs ok?
	- try using tracks?
	- should tracks be combined via images ?

	-> add step to do track merging based on required image combinations
		- get exact list of all intersections that will happen
			- after points are loaded (pending list or new list)
			- add method that will only return all existing+additional point intersection combinations
			EX:
				- existing point
				- additional point
				- overlapping views [multi-way intersection w/ existing?]
				- additional views
			- resolve what 3+ images should be loaded

		- only resolve points that have images loaded?
			-> guaranteed 2 ?
				- use affine relation for non-loaded images
			-> all images?
				- can throw away obviously bad track matches?
			-> most images?
				- combination ^ ... no guarantees

	- double check resolution logic
		- 

	- ...

- are groups combining points based on images?
	- update intersection resolution to use images ?



=> TEST CASE: do point loading & optimizing & print out world & view results
	=> first 2 separate pairs (3 max tracks)
	=> print out some example point image match location









.........




- when triples is done: is trying to make triple tracks worth it?
- when combining pairwise tracks into dense (/ track_full step) is doing visual point optimizing worth it?
- 




- back to walking thru sample ...

- could assume ordered set of images and use that to get initial matches ?



- initial hierarchical location can be off by a lot



flatAffineImageMatch

hierarchicalAffineImageMatch


- is using the blob matching a better way to find initial match?
	- blobs need to keep:
		- pos OK
		- size OK
		- angle  <= this is not being stored x


- initial affine mapping is not very good
	- more exhaustive attempts?
		- position ?
		- separate chunks of the image
			- 9x9 ?
		- use most common (average sigma drop) values: offset, scale, angle


some metrics :
	- coverage area (need to use a finite method to count areas)
	- average matching scores
	- 



histogram
	- try nearest neighbor binning too
	- 















NEXT STEPS?
	- hierarchical not working so well
		- issues
	- .. get back to flow


- get scores from hierarchical
	- both directions
- see what example scores end up being?



flatAffineImageMatch
hierarchicalAffineImageMatch











https://www.statisticshowto.com/probability-and-statistics/chi-square/

- low-res image flow given overall starting angle & scale [5x5 - 7x7]
- hierarchical image flow:

- 


- to score a match:
	- % of matches inside valid area
	- average score of valid matches
	=> (1/percent) * (averageScore)

3/4 + 0.5




- histogram: each image limit to best 1-sigma or up to 50 [1k-100k samples put in histogram boxes]
- low res icon matching: each image limit to best 1-sigma or up to 25 [5x5-7x7 = 20-39 points] 7
- med res icon matching: each image limit to best 1-sigma or up to 10 [9x9-11x11 = 64-96 points, can use previously estimated angle & scale]
- feature matching: each image limit to best 1-sigma or up to 6 [100-1K features]


- histogram limit to top ~ 50
- icon matching limit to top ~ 10
	- 7x7/9x9 to top 25
		- get best angle & scale
			- 7*7*(pi/4) = 39
			- 9*9*(pi/4) = 64
	- 11x11 to top 10
		- use best angle & scale & ~ 45deg & 1.1 scale tolerance
			- 11*11*(pi/4) = 95
			- 21*21*(pi/4) = 347
- feature matching limit to top ~ 6



still some shifting somewhere in display logic ?


infoForScale

getProgressiveScaledImage




compareCircularBestImage





- find best affine transform for a given image
	- low res ~ 7
	- do exhaustive search
	- limit range at each next step
		- 11, 21, 41, .. 
		- 15 deg, 10 deg, 5 deg, .... 0
		- 1.25 scale, 1.1 scale, 1.01 scale, ...
	=> the 'center' of each would change ....



- ImageMatScaled.affineToLocationTransform(affine,affine, iconHalf,iconHalf, centerX,centerY);
	- iconHalf needs to be EXACLY HALF, NOT TRUNCATED




- TEST INITIAL DATABASE MATCHING AGAIN
	- ICON
		- 'best' pixel in area error


	* load all N images
	* get 'icons'
	* do icon testing





- TEST FAT FEATURE -> F
	- show each step in process to know where failures reside











OPTIMIZING SINGLE VIEW AT A TIME:
	solveOptimizeSingleView


- sparse bundle adjustment going poorly
	- maybe can't do surface stuff if there are a lot of bad points (maybe 0.2-0.5 of points are wrong)

optimizeAllCameraExtrinsicSurfaceDistances3D
	-> lots of 0 denominators


- lost of bad pairs in DENSE process
	- possibly due to bad camera initialization in sparse


- maybe not quite enough tracks for dense bundles



x clustered points (eg 4-8 neighbors) need to have the same overall affine rotation/scale
	-> find outliers?
x visualize the angles & see if this is useful ?

x local average angle? => YES
x local average scale? => YES

x local average affine displacement?
	- look at where all neighbors are vs where they are predicted to be thru affine
	- each match averages it's displacements


- initial database matches have a lot of incorrect results
	- is it worth doing more direct compares?
		- hist
		- feature
	- adding different metric?
		- image 'icon' 10x10 = 100 (79) ->  21x21 = 441(347) oriented pixels
			- CIRCULAR CENTER CUTOUT: ratio: pi/4 = 0.78...
		- compare at ~ 5 scales, ~ 30 angles = 150 compares
		- compare:
			- RGB vector distance [SAD]
			- SSD
			- RIFT-SAD
		- use best compare


- fat-match sequence ends with poor initial results
- fat-match sequence slow
	var F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
		? F = R3D.fundamentalMatrixNonlinear(F, pointsA, pointsB);
			? R3D._gdFun = function(args, x, isUpdate, descriptive)



- visually had good F-pairs, but F-error & R-error were very high & alg quit


Stereopsis.js:525 REMOVING NULL POINTS3D: 0
09:42:51.082 Stereopsis.js:13497  - dropNegative3D: 0 / 601



R3D.fundamentalFromUnnormalizedMaxCheck


transformCameraExtrinsicNonlinear



TAKES A LONG TIME:
	var result = R3D.matchesFilterFundamental(matchesAB, imageScalesA,imageScalesB);


repeatFilterExtendMatches


- REDO ALL THE FILTERING STEPS ITERITIVELY ?
	- get F rough
	-> initial calc F
		REPEAT?: [max 10 interations or match cound change is <1-5%]
		- get/increase local neighborhood F 
		-> recalc F
		- filter on F error
		- filter on N error
		- filter on S error
		-> recalc F
		- filter on affine displacement
		- filter on angle difference
		- filter on scale difference
		- filter on neighbor fwd/bak consistency counts
		-> recalc F

- related neighbors counts
	- each match FWD/BAK neighbor count percent that exist?
	- local OR global?
	- hard cutoffs at like less than 25% ?

- local average SAD score ?
	- local distribution of scores


- MORE MATCHING FILTERING ?
	- affine local expected displacement distribution
	- local average angle distribution 
	- local average scale distribution
	- neighbor matching count distributions
	- global match SAD scores
	- global F error
	- local F error?
	...........

- MORE MATCHING OPERATIONS
	- refine match locations
	- search around neighborhood for matches


- SEQUENCE:
	- raw features
	- raw all-features matching
	- raw affine approximation from neighborhood
	- LOOP: 
		- refine affine matrix [nonlinear optimize SAD score]
		- refine location [nonlinear optimize SAD score] - reposition B location
		- filter global F [drop worst F error matches]
		- filter global match SAD / RIFT score [drop worst SAD scores]
		- filter global neighborhood forward/backward consistency [drop worst neighbor counts]
		- filter local rotation [drop worst consistent rotation angle difference]
		- filter local scale [drop worst consistent scale difference]
		- filter local affine predicted location fwd/bak difference [drop worst predicted/actual location]
		- extend neighborhood [find/add local matches from best inliers]


R3D.filterMatchesOnLocalAffineDifference

showForwardBackwardPointsColor



- FULL COMPARE ALL A TO ALL B:
	R3D.compareProgressiveRIFTObjectsFull = function(objectsA, objectsB){
- KEEP ONLY MATCHES WITH BEST RATIO
	R3D.compareProgressiveRIFTObjectsMatches(objectsA,objectsB);
- ADD AFFINE MATRIX TO MATCHES
	R3D.relativeRIFTFromFeatureMatches
- VARIOUS REFINE:
	R3D.dropOutliersSparseMatches
			var info = R3D.separateMatchesIntoPieces(matches);
			
			info = R3D.experimentAffineRefine(pointsA,pointsB,affinesAB, imageScalesA,imageScalesB);
			
			// possibly filter scores here too to limit next step?

			// refine location:
			info = R3D.experimentLocationRefine(pointsA,pointsB,affinesAB, imageScalesA,imageScalesB);
				
			// group
			info = R3D.groupMatchesFromParallelArrays(info, imageScalesA,imageScalesB);
			matchesAB = info["matches"];
			console.log("START MATCHES: "+matchesAB.length);

			// score
			info = R3D.repeatedDropOutliersScore(matchesAB, imageScalesA,imageScalesB);
			matchesAB = info["matches"];
			console.log("KEPT SCORES: "+matchesAB.length);

			// extended neighborhood
			info = R3D.keepExtendedMatchNeighborhoods(matchesAB, imageScalesA,imageScalesB);
			matchesAB = info["matches"];
			console.log("KEPT NEIGHBORHOOD: "+matchesAB.length);

			// F
			info = R3D.repeatedDropOutliersFundamental(matchesAB, imageScalesA,imageScalesB);
			matchesAB = info["matches"];
			console.log("KEPT F: "+matchesAB.length);

			// scores 2
			info = R3D.repeatedDropOutliersScore(matchesAB, imageScalesA,imageScalesB);
			matchesAB = info["matches"];
			console.log("KEPT SCORE: "+matchesAB.length);














































































R5O3VSIP-WC1YFNBS
- should be an easy to get pair, very wrong orientation
	
	- recheck steps of algorithm

- 3D R ransacing?
	- 




- not enough pairs found during sparse ..... 
	- maybe needs to be more forgiving ?
	- maybe needs to try more of the top pairs?



- if sparse is unable to include all views -> make sure only the final group continues to be used in subsequent app steps




- other pairwise metrics than reprojection error?

- finish out the current test case with whatever current best methods are

- not sure which of the metrics are useful/not
	- may be fighting eachother ?

x try d^2 & d metrics to see what is better?

- 3D location drifting ? (smaller scale has less error)

- decide how to use nonlinear surface & R-error algorithms 
	- sparse
		- individual view optimize reprojection GD
		- world iteration projection error GD
		- world iteration static P3D GD
		- individual views do surface error GD
	- dense
		- individual view optimize reprojection GD
		- world iteration projection error GD
		- world iteration static P3D GD
		- all views surface error GD

- need a metric for the world to iterate on to know if done or not
	- R is only useful initially
	- R is ~ useless in dense
	- 



- try removing outliers in groups via surface error/distance
	- identify/ignore points/aread with no adjacent surface mapping (not useful for algorithm)

- EX:
	- each P3D records [temp()] a list of other points it has been found to 'share' 2D space with
	- globally drop the P3D with highest average 3D distance ?



- GROUP - BUNDLE OPTIMIZING ??????????????????????????????????
	solveDenseGroup
		- some really high pixel errors - exponential looking graph


- does K need optimizing in tracks / group?




- some BA metric related to surface distances
	- raw distance metric needs to be in some reference space [eg point or view volume]

- try algorithm with connected tracks

- try verifying only a seingle triple-surface-group is ever created at a time



- probably don't need quite so many points / resolution for the dense / group stages (can drop more of the worse points)
- 

- surface blending is bad - has a lot of fading between different texture points that don't line up

- groups can do a process that moves the structure toward eachother - various midpoint pushing
	- NOT THE CAMERAS
	- JUST THE POINTS
	- an additional step at the end that iterates the points toward their counterparts
	- points without counterparts can be dropped? [a support of only 2 views]
	- points keep their original point
	- their computed point is a median of all the neighbor points
		- nonlinear step?
			- want to minimize distance from ORIGINAL POINTS
			- want to minimize distance to AVERAGED POINTS ?
		- iteritive steps?
			- after points are all updated, do the same thing again, using the updated points?
			- need to 'anchor' points around original location -- so maybe only this value never changes?





- DLT CAMERA INIT FROM P3D-P2D KNOWNS
=> QR DECOMPOSITION?
https://www.ipb.uni-bonn.de/html/teaching/msr2-2020/sse2-13-DLT.pdf
http://www.cs.ucf.edu/~mtappen/cap5415/lecs/lec19.pdf
https://www.ipb.uni-bonn.de/html/teaching/msr2-2020/sse2-12-camera-params.pdf
https://www.math.ucla.edu/~yanovsky/Teaching/Math151B/handouts/GramSchmidt.pdf
http://www.seas.ucla.edu/~vandenbe/133A/lectures/qr.pdf

http://people.scs.carleton.ca/~c_shu/Courses/comp4900d/notes/camera_calibration.pdf
https://www.cs.cmu.edu/~16385/s17/Slides/11.3_Pose_Estimation.pdf






- nonlinear way to optimize surface distances


optimizeCamerasFromSurfaceDistanceMapping3D
- only ever want the same triple once
	- idA-idB-idC-pAID-pCID ? lookup hash?




.................................>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> the multi-camera reprojection error is not a useful metric when looking at the visuals


- reprojection error going up from 2.0 to 2.2...2.4 still looks better with the views aligned by surface



- are there odd situations for midpoints / surface nudging that should be avoided?


- does LM help? - ?

- OUTLIERS

- OTHER METRICS?
	- currently:
		- r-error
		- pairwise surface-distance

- better ways to push surfaces toward eachother --- & what biases might there be?
	- midpoint is proving better than the euclidean transform approx



TOGGLE THESE ?:
	optimize all cameras & keep points static ?
	optimize points & keep cameras static?




optimizePairTransformsFromMappingP3D + refineAllCameraMultiViewTriangulationGD
	-- error goes high up?
	=> pick lowest error points?
	=> check for outliers?

- any assumptions / fallacies in new algs?

- if there are scale changes, the euclidean half-way transform may not be best?
	- try point averaging? [this allows more non-linear-ness]

- try DLT initting cameras from new P3Ds?

- do other typical loop things:
	x drop negative
	x drop based on error
	- ...



- OTHER TYPES OF METRICS THAT CAN BE USED TO HELP ITERATE TOWARD OPTIMUM SOLUTION ?


- nonlinear fxn that optimizes with a metric of distance between mapped points [surfaces]?
	-> move surfaces toward each other





=> 'pushing' views toward each other all at the same time may be an issue?



- try figuring out new camera location via half-way points
	[rather than just moving the camera frame]


-> try moving ALL P3D to new locations, then iterating on individual cameras to update location


	LOOP: MOVE CAMERAS-TO-POINTS & MOVE-POINTS-TO-MEDIAN

		-> P3D calculated from camera parameters

		A) optimize camera parameters from 3D projection
		-> recalculate P3D locations
		-> update P3D to be median locations from neighboring view-pairs
		B) optimize camera parameters from 3D projection
		-> recalculate P3D locations
		=> goto start

			HOW TO DO THIS PRACTICALLY:
				A) keep track of all the temporary changes & reuse the global iterator
					go thru each connected pair
						each P2D that is changed gets it's temp set to the 'new' location
				B) keep track locally of the views & P2Ds & P3Ds that are changed
					each pair estimate new P3Ds given P2D locations
					store in outer loop
					do subsample of all these new 3D points
					DO GLOBAL ITERATION INSIDE FXN



		-> SAVE POINTS AT HALF-WAY THRU PROCESS TO SEE WHAT IT ENDS UP LOOKING LIKE?


=> DO CAMERA MATRIX PARAMS NEED TO BE DETERMINED FROM SCRATCH, OR CAN THEIR PARAMS BE UPDATED THRU NONLINEAR STEPS?






=> graph expand:
	- minimize error on a single edge -> then expand outward on graph in some order




- if ALL possible triples estimated using top pairs is run: is everything averaged out?
	=> focus on a single view at a time -> bring all adj views to line up with this view


- FINDING 3D MATCHES:
	- for a set of 2 pairs matched via nexus view (a triple)
	- filter only top 50% of P2D from transform matches pairAB & pair BC
	- place pairBC points into pointspace
	- for each point in pairAB:
		- find closest pairBC point & add to found matches (if distance < 0.5 * cellSize)
	- filter only top 50% of P2D matches on error = (Rab+Rbc)
- ESTIMATING NEXT ABSOLUTE CAMERA MATRIXES:
	- find world 3D mapping for P3D: Pab -> Pbc
	- calculate half-mapping location for A & C
	- add predicted new absolute matrix to A & C lists
- 



https://math.stackexchange.com/questions/3767691/exactly-half-of-a-3d-transformation-matrix
https://www.geometrictools.com/Documentation/InterpolationRigidMotions.pdf




- use close 2D points to push cameras toward matching areas
	- group of vectors for each nearby pair
		- try to find an optimum euclidean transform for the 3D points
		- 
	- use 'half' of the transformationf for A & inverse-half for B
- combine 3D matrixes in some % based method ?


-> DLT + nonlinear step?


http://nghiaho.com/?page_id=671
(R * A) + t = B
H = (A-cenA) * (B-cenB)^T
SVD(H)
R = V * U^T
R x A + t = B
t = cenB - R x cenB
(follow with nonlinear parameter estimation step)

https://medium.com/machine-learning-world/linear-algebra-points-matching-with-svd-in-3d-space-2553173e8fed
https://colab.research.google.com/drive/1pZPV5GuR7ZPW6vyoG8DnawJx13k6zHmD

http://graphics.stanford.edu/~smr/ICP/comparison/eggert_comparison_mva97.pdf

https://arxiv.org/pdf/1812.11307.pdf












Code.averageTransforms3D = function(transforms, percents){

Code.transform3DFromPointMatches(pointsA, pointsB);


R3D.euclieanTransform3D = function(pointsFr,pointsTo){ // find euclid matrix [3x4] : from->to










MATCHING UP TRANSFORMS TO OTHER TRANSFORMS
	EG: A+B to B+C [map A to C thru B]

	for each view B:
		for each cell
			for each point
				find a neighboring points
				put into grouped arrays, eg:
					- A-B-C
					- A-B-D
					- C-B-D
					- ...
				-> keep only closest point in each grouping
				-> keep top up to ~ 3 points & average the expected 3D location ?

		for all groups (with enough point matches)
			calculate 3D transform

matching up a list of pairs:
	- get all top transforms for pairs with some sigma-valued number of points
	- get list of 3D point matches
		- for each cell:
			- get all matches within radius w/ matches A->B
			- 
		- need some minimum number of point matches
	- estimate 3D euclidean transformation between transform views A & B
		- get 'half' of transform
		- add half of A->B to A
		- add half of B->A to B
	- each view averages together list of matrixes (based on error? inverse error?)
	- each list appends this delta matrix to current absolute matrix















=> SIMULATED ANNEALING / RANDOMIZING SOME ROTATION / LOCATIONS


- how to deal with local minima
	-> start at some degree of variability and taper off
		-> change camera locations
			- don't move more than nearest neighbor (maintain directional orientation)
				- get a vector to each & find limit of half-plane movements [views with substantial match correspondences]
		-> change camera rotations
			- don't rotate 'too far away' from neighbors
				- not AT eachother
				- not AWAY from eachother
		-> reprojection-error based?
			- does a pixel error translate to a rotation / offset ?
				- ROTATION:
					- project from center 0,0 & eps,eps rays -> get angle from these rays
					=> these movements can all be done independently
				- TRANSLATION
					- projected ray -> move focal length (average of fx & fy)
					- half-plane limits
						- new position of camera has to stay in half-plane side of original location
					=> these movements need to be done sequentially



GLOBAL / LOCAL / OPTIMIZATION

Strategies for Global Optimization

https://towardsdatascience.com/strategies-for-global-optimization-79fca001c8bb

Simulated Annealing

https://en.wikipedia.org/wiki/Simulated_annealing


Perturbation / Agitation







https://web.maths.unsw.edu.au/~rsw/lgopt.pdf
 Optimization Problems
. Variables
. Objective functions
. Constraints
. Discrete vs Continuous
. Available information
. Optimality
. Problem size
• Local Methods
. Steepest Descent
. Newton
. Quasi-Newton
. Conjugate Gradient
. Simplex

Local vs Global minima
. Continuous examples
. Travelling Salesman Problem (TSP)
. Minimum Energy Problems
• Exact methods
. Enumeration
. Branch and Bound
. Interval Methods
• Monte-Carlo Methods
. Random points
. Random starting points
. Quasi-Monte Carlo methods
. Sparse Grids
• Simulated Annealing
. Accept larger functions values with certain probability
. Annealing schedule

Evolutionary (Genetic) Algorithms
. Population of individuals (variables)
. Survival depends on fitness of individual
. New individuals from genetic operators: crossover, mutation

Quasi Monte-Carlo (QMC) Methods














iteration error minimization assessment:
	gradient descent:
		- maps the 6n camera parameters into a single error value [6n times to get a jacobian]
		- provides a coarse direction for parameter improvement
	lm:
		- maps the 6n camera parameters into a vector of the 2m 2D-projection-points
		- operates on each individual point to provide a more detailed directional improvement
			[matrixes are huge]










WAS filterGlobalMatches SUPPOSSED TO BE LINEARLY ?



- change some values in the GD method

- GD epsilon may need to get smaller as the changed x values decrease



bundle adjust is not converging
	- too noisy around solution?
		- convexorize / smooth the error fxn
		- 
	- check the gradient descent algorithm / steps

	- RANSAC ??

	- adding cameras one at a time ?

	- exhaustive paramater space testing ?

	- monte carlo ?

	- TFT & triples ?

	- normalization ?

	- levengerg marquart algorithm


CAMERA RESECTIONING - get P from X & x (eg from other cameras)
	- ...











HOW TO SPEED UP BUNDLE ADJUST:
	- extrapolate final destination: location / orientation
		- abs vs rel

	x more iterations with fewer points ?

	- 

	- other metric / method?








solveDenseGroup


solveOptimizeSingleView

PAIR:
	world.refineAllCameraMultiViewTriangulation(100);
TRACK_FULL:
	world.refineAllCameraMultiViewTriangulation(iterationsAll, false);



- tracks still fuzzy -> want them to look like the dense pairs

	-> try not intersection resolving [dont combine points more than original 2]

	-> try lower resolution cells to force more intersections

	x> try nonlinear P3D estimate

	-> look at metrics used to optimize camera location

	x> camera ALL AT ONCE vs camera SINGLE ?

	-> only 3+ tracks

	-> filter out highest-error points (3D reprojection error)


- deciding which images to load for track bundle should be based on graph and not DIRECT intersections



-> R ERROR IS LOW, BUT STILL LOOKS FUZZY
-> in bundle group the R error is high

	-> show same error metric ?

-> make whatever the failing cases are more important ?

-> is it rotation related?





refineAllCameraMultiViewTriangulation
var result = R3D.optimizeAllCameraExtrinsicDLTNonlinear(listExts, listKs, listKinvs, listPoints2D, maxIterations, true, onlyZError); // negative bad?





bestImagesToLoadForViewPair
iterateSparseTracks



- how tracks should be setting the P3D patches
	- everything 3D needs to be recalculated
	- only P2D points are the same

- 



- combining tracks using images ?
	- all images
	- some good subset?

- test by loading all images & running algorithms per usual


resolveIntersectionLayered












????

BUNDLE

// world.initAllP3DPatches(additionalPoints);
// world.initAffineFromP3DPatches(additionalPoints);


.................





HOW BEST TO COMBINE TRACKS (w/o images ...)
	- try with images ?
		- N images at a time or some such ...





WHO IS FIRST?
world.initAllP3DPatches(additionalPoints);
world.initAffineFromP3DPatches(additionalPoints);

world.initAffineFromP3DPatches(points3DExisting);
world.initAllP3DPatches(points3DExisting);





ARE TRACKS CALCULATIONS USING CAMERAS FROM GRAPH ????









triples:
- each point needs to be updated using the new K matrix
-> calculate & update it before inserted into world






why are points still noisy / even with sub-pixel reprojection error


- how to use different Ks when calculating triples ?
	- for each camera with the same ID:
		- average the K matrix equally / based on some error
			...

- sparse patch udpating same as dense?
- update patches after K update?
x saving cameras to pairs
-
- 




=>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> POSSIBLY UPDATE OTHER AGLORITHMS TO USE LM ITERATION
	- F
	- P
	- camera K components
	- 3D points ?
		- this only needs to be done a point at a time




3DR
	- new simple set
	- use the camera in the correct locations
	- use a 'default' camera 
	- do camera optimizing & averaging
	- check each of various algorithms
	- check how patch algorithms work





- what happens with a camera intrinsic matrix is changed?:
	-> the estimated DLT 3D location changes
	-> the projected 2D location changes










lots of steps have a non-linear piece to go from LINEAR ESTIMATE to more accurate setting
	- P3D are reset every time
	=> do P3Ds need to run the nonlinear step after linear step each time?
		- does normal & size need to be updated?

- is patch-size/normal all figured out yet?


HOLE FILLING
	- what hole should be filled [planar & distance between points ]
	- what holes should not be filled []



- is group-combining logic good at finding/removing outliers
	- EG: BENCH-ROCK IN-BETWEEN bad points?








add step in global aggregation to combine separate camera updates from sparse/dense
	- average each component (weighted by R error?): fx, fy, s, cx, cy [in normalized coordinates]
	=> how to use updated camera ? 
		- only after dense -> use it in graph / bundle / etc ?
- how to use unknown camera & refinement thru 3DR steps (sparse dense graph bundle ...)
- assume [1 0 0.5 ; 0 1 0.5; 0 0 1] normalized camera to start -- absolute scale is only missing param

- steps:
	- INITIAL - use either an assigned camera or default to the default standard guess
	- SPARSE
		- CAMERAS are saved initially
		- PAIRS have cameras & optimize separately
		- GRAPH can combine globally from pairs [weighted average]
		- TRACKS (skeletal & full) can keep as-is or also optimize
	- DENSE - same as sparse
	- BUNDLE - has cameras for group iterations (optimizing here might not have much benefit -- view extrinsic locations are fixed)
	- SURFACE - cameras are saved in VIEWS

=>?=> external pairwise matrixes will change if camera changes ???






ENCRYPTION:
- dont allow overwrite unless listed in input list as -f
- skip sha1 & fwd/bak checking


OPTIMIZE Matrix.inverse .... with REUSE matrix output


NEIGHBORHOOD SMOOTHING ?
- move P3Ds along normal toward COM of neighborhood ?

SMOOTH:
	- for all P3D:
		- get 2D-3D-N & get 8 ~ 10 kNN 
		- get sigma distance
		- window / weights = exp^ - d^2/s^2
		- get local plane using weights
		- get new location = ray from Vavg to P3D => projected onto plane
	- set all P3D locations to new locations




PATCH NORMAL FILTERING:
	- per view:
		- drop normals who's angle away from view is over:
			A) maximum threshold (eg 90 degrees)
			B) much higher than average (mean + sigma)
	- per point
		- drop points whos average normal from all relevant views is over 
			A) threshold ~ 90
			B) mean + sigma






OPTIMIZING ON CAMERA PARAMETERS ?
[fx  s  cx]
[0  fy  cy]
[0   0   1]

ALL TOGETHER:
	fx stays constant -> 4 variables

SEPARATELY:
	- centerpoint: -> 2 variables [2]
		cx & cy
	- focal: -> 2 variables
		fy & s
		fx stays constant

- get some sub-sample of P3D points [100-1k]
	- gradient descent iterate on:
		- total error = sum of P3D reprojection errors:
		- set normalized K from parameters [fx, fy, s, cx, cy]
		- get image-sized K by multiplying by image dimensions for each view
		- recompute each P3D location & error:
			- P3D = P2D_i,j,k.. * view_i * K_i
			- reprojection = 
			total += error







PATCH STEPS:


- initial steps: < 1k
	- init patches from view geometry
		- refine patch visually
- medium dense 1k-10k
	- init patches from neighborhood plane
	- update patches from neighborhood plane
		- refine patch visually
- dense > 10k
	- init patches from neighborhood average
	- update patches from neighborhood average
		- refine patch visually
	- 

...



- INITIAL:
	world.setResolutionProcessingModeFromCountP3D([]);
	... embed
	world.updatePatchesPoints3DFromNeighborhood(points3DAdd);



			this._resolutionProcessingModePatchInit = this.initP3DPatchFromVisual;
			this._resolutionProcessingModePatchUpdate = this.updateP3DPatchFromVisual;
			this._resolutionProcessingModeAffineSet = this._resolutionProcessingModeAffineFromPatch3D;

???





























- display the patches (circularly) projected onto the views


- approximate a point's normal from neighborhood (8 ~ 16 kNN)



- points not in the world can't use 





- re-evalute various alogirhtms for dense pair matching (from seeds)
	- patch/normal
	- combining track points (blind)
	- combining group points (images)
	- smoothing of points after group combine


Stereopsis.World.prototype.initP3DPatchFromVisual
	this.initP3DPatchFromGeometry3D(point3D); --- just average of view normals
	this.updateP3DPatchFromVisual(point3D);
		var result = R3D.optimizePatchSizeProjected(location3D,size3D,normal3D,up3D, ps2D,sizes2D, extrinsics,Ks); --- may need to be re-estimated to minimize error
		var result = R3D.optimizePatchNonlinearImages(location3D,updateSize3D,normal3D,up3D, ps2D,imageScales, extrinsics,Ks);
			var error = R3D._gd_SAD_IMAGES(needleA,needleB, mask2D); --- double check sizing & steps



how to calculate patches in dense
	- patch size/normal ?


"how to combine track points ?" (blind)
	- want reprojection error to have a say (too high == ignore)
	- patch size/normal ?

- how to combine group points (dense, non-blind)
	- patch size/normal ?
	- 
- 

- do smoothing at end of group combining?






combinging in group:
	- resolve collision by error (ignore error ~ 2x that of self)
	-> or if resulting new P3D is much worse (average) R,F,N,S -> just keep original best point

combining tracks (w/o images):
	- pairwise only?
	- 


ADDITIONAL ALGS TO TRY:
	SMOOTHING LOCALLY:
		- get all 2D & 3D neighbors
		- A)
			- approximate plane from neighbors
			- set next location = projected planar location
		- B)
			- get average location of all neighbors
			- set next location = average location
		- move all points to next location
	PRUNING BAD LOCALLY:
		- for each transform
			- get transform-wide errors for R & F & S & N
			- transform global limit = actual mean + 1 actual sigma
			- for each point:
				- get 2DA+2DB+3D (intersection) neighbors
				- get average of neighbor errors
				- limit for each error =   ~ 2 x neighbor
				- if this match's error (R | F | S | N ) is  >  limit local
					- mark delete of this match
				- if the entire group's error > limit transform global
					- mark delete of this match (or entire group?)
			- delete marked outlier matches
	=> single outlier
	=> group outliers

individual is way worse than neighbors or group is way worse than global



- how are patch normals calculated?
	=> mostly just pointing to source views
		- recheck this
	=> CHOOSE BEST METHOD
		- list possibilities


R: 1.5... with refine p3D in loop
R: 1.5... w/o refine p3D in loop



CHANGE 2D/3D CODE FOR NEIGHBOR INCLUSION
	= instersection of 2DA + 2DB + 3D











- other methods of pruning points?
	2D
	3D
	2D-3D
	multi-metric
		- R x F x N x S - maybe a little ?

	PRUNE:
		- if me & my group are all over X error -> mark self for drop
			- slightly less forgiving than general population?
		=> if global R-error is 3.0
		=> local window is 3.0 * [0.66,0.75] = [2.0, 2.26] => if self AND KNN AVERAG are below this -> drop self
		=> 2.0 * [0.66,0.75]  = [1.333,1.5]
- start at large error window & progressively make more strict (3.0 sigma -> 2.0)



- smoothing:
	- in 2D+3D point neighborhood move point along normal / along view direction to plane average depth (gaussian falloff?)
	- 

6
DENSE IS STILL BAD:


	- look over process and find possible points of contention / improvement
		- location metric:
			SAD relative
			SAD absolute
			NCC rel/abs
			gaussian window falloff
			circular window
		- border dispute retraction
			- design propagation around seed point definition
		- combining
			- use relative error for pairings points into group
			- use relative error of scalings - in abs combining [final scale range / sigma]
				- add/multiply scale error to the absolute transforms
			- 'pruning' in final combined group
				- isolated points (neighborhood distance/count ? relative to camera distance ?)
		- 



calculatePairMatchWithRFromViewIDs
	solveDensePairNew

	subDivideUpdateMatchLocation


	R3D.optimumSADLocationSearchFlatRGB
		// 



var scores = R3D.searchNeedleHaystackSADColor(needle,haystack); 				- R : 0.000009360217525096162 +/- 2.5126658894379714
var scores = R3D.searchNeedleHaystackSADColorOffsetUnit(needle,haystack); 		- R : 0.000029171387879161067 +/- 1.4733003176743598
var scores = R3D.searchNeedleHaystackNCCColorOffsetUnit(needle,haystack);		--- need to make this  smaller is better ? (negative ?)
searchNeedleHaystackSADColorOffsetUnit - SAD -								 	- R : 0.00003548522545991383 +/- 1.6004984398999957
			

SSD


circular flat:

gaussian 1:
 T 0 0->1  R : 0.000008958243591265803 +/- 1.4611134092259292
 gaussian 0.5:
 T 0 0->1  R : 0.000016489749943791584 +/- 1.5260758436965476
...








R3D.searchMatchPointsPair3D



dense R search print matches


- need a way for incorrect matches to be overtaken by correct 2D neighbors

- is it better to use get points in SPHERE or KNN ~ 9-18 ?

- when combining points from dense pair into group -- maybe only the better pairs / points should be used? -- 1.0 vs 3.0 R error average pairs

- combined group is not exactly aligned
	- combined dense pair points are noisy
	-> does the combined group do any king of noise reduction?






var info = R3D.experimentLocationRefine(samplesA,samplesB,affines, imageScalesA,imageScalesB);
console.log(info);
scores = info["scores"];
samplesA = info["A"];
samplesB = info["B"];
affines = info["affines"];


- TESTING ALGORITHMS
	- display matches as colors
	- 
	- neighborhood consistency
		- look at neighbors
	- drop outliers again:
		- F
		- score
		- 






- pairs & groups have poor points all over (clouds)
	=> is the clouds a result of poor seeds?
	=> 3D patch filtering?

- back to neghborhood keeping to verify seeds

- go over each alg & see if logic or speed can be improved





calculatePairMatchFromViewIDs























- some bandaids:
	eg: 
		- delete a p2d/match in a view if it is the worst NCC score of its 8 kNN (or do a radius?)

- how full-blown seed/grouping would/could work


- address similar error but wrong seed point / propagation
	A) multi-view:
		- check that obstruction voting (fwd & bak) is finding & voting & weighting appropriately
	B) check that all propagation happens AFTER all sources have a chance to find a best guess
x		- symmetric & only preferential to better result (NCC?)
		=> didn't seem to help
	C) add ancestor parameter:
		- on propagate: new P3D ancestor references source P3D
		- on collision:
			- (subsumed [eg pair replacement]) winning P3D deletes losing P3D & ancestor [if exists?]
			- other collision: set ancestor as 
				- array of both? -- could get big
				- worst NCC score P3D? -- make sure to remove the worse score not the better score origin
				- best NCC score P3D? 
		- on other filtering do anything?
			- R / F / N / S ?
			- 
x 	=> doesn't seem to help




probe2DCellsR

filterGlobalPatchSphere3D

resolveIntersectionLayered

world.killPoint3DAncestor(point3DB);




- what to do when point is much further than the camera point spacing
	=> global sphere R = lambda * sphere centered on views @ average center
	- step that checks P3D distances & caps it R, in direction of average v vector? or in direction of radius



- some affine-visual optimization somewhere (patches) to replace with rot+scale
- some visual rect extraction somewhere to replace with reusable needle/affine


x new P3D (create/insert) optimize location closer - helps very mildly


- if pairs can't remove globs of garbage, maybe groups can?
	- obstruction tests
	-> how is current sphere-obstruction working


- in-process - test how close the features are to the final location:
	- after initial set of matches
	- during world pair loop with patches
	---- display a few random points


- why are some initial points so far away from each other IN 3D ???????



- HYPOTHESIS: seed points are root of a lot of the poor noisy points


- aggressive adding & aggressive removing
	(good points will be re-added)


21:35:57.504 Stereopsis.js:7142 null
21:35:57.504 Stereopsis.js:7143 TypeError: Cannot read property 'x' of null
    at V3D.set (V3D.js:289)
    at Function.R3D.projectivePatch3DToAffineList (R3D.js:27405)
    at Stereopsis.World._resolutionProcessingModeAffineFromPatch3D (Stereopsis.js:7133)
    at Stereopsis.World.affineP2DFromMode (Stereopsis.js:7067)
    at Stereopsis.World.probe2DCellsRF (Stereopsis.js:14558)
    at Stereopsis.World.probe2DCellsR (Stereopsis.js:14332)
    at Stereopsis.World.solveDensePairNew (Stereopsis.js:8880)
    at solveWorld (App3DR.js:12797)
    at App3DR.ProjectManager.checkLoadedAllImages (App3DR.js:12639)
    at Image.image.onload (App3DR.js:25594)
21:35:57.505 Stereopsis.js:14564 bad again A ... inside probe 2D



- show extractRectFast @ different scales

https://www.cambridgeincolour.com/tutorials/image-resize-for-web.htm
https://www.fxguide.com/fxfeatured/keeping_your_renders_clean/
https://legacy.imagemagick.org/Usage/filter/
https://people.inf.ethz.ch/~cengizo/Files/Sig15PerceptualDownscaling.pdf
https://johanneskopf.de/publications/downscaling/paper/downscaling.pdf

- SINC
https://clouard.users.greyc.fr/Pantheon/experiments/rescaling/index-en.html


- cubic for full image rescaling

Lanczos3
lanczos
perceptual


https://www.dpreview.com/forums/thread/4036161



- dense matching problems:
	- repeated structure is wrongly matching (likely good NCC score)



imageScalesA.extractRectFast(needle, averageScale, affine);

	- is effective scale: wA/wB or (wA-1)/(wB-1) ?




Code.parallelArrayInterpolateCubic(listTo,listFr, index, p.x,p.y, imageWidth,imageHeight);
TODO - parallelArrayInterpolateCubic - odd behavior outside image



- interpolating minimum IN PRACTICE is worse than just finding the lowest pixel?
	- maybe some other step is wrong?
	- zoom/scale?
	=> keep testing localizing, using real images / scores

	... are pixel positions off by 0.5 anywhere?
	- ImageMat pixel color interpolation
	- subDivideUpdateMatchLocation / optimumSADLocationSearchFlatRGB / R3D.minimumFromValues
	=> i,j IS CENTER OF COLOR/VALUE


- how are affines updated for patches when R is known?

- when optimizing P2D+P2D+P3D - reprojection error:
	- can move one of the P2D?
	- can move just the P3D?
		- look at estimates before & after ?

...

- try to trim down time costs in main loop




- what to do about areas that have large lighting changes
	- windows reflection is very different from view to view
	- ... a correct point will still have a bad NCC score


- test by using only 1-5 very correct pairs and seeing if the seeds are all that matters?
	(don't subdivide till late)





resolve intersection isn't using this?: --- only needed for groups ? pairs are always chosen A or B
_resolveIntersectionLayered



- groups: a lot of still floating points that would expect to be removed as obstructions
...









- a way for propagated points to test to see if other groups are valid?
- a way for points to retry neighbors (non-empty neighbor scenario) to check?


=> need to 'eat away' at the bad seed's propagated points


=> want to retry cells even if there is already an item there

- GROUP PROPAGATION:
- propagated point (or seed point) has a group ID
	- when two points from different groups meet up:
		- propagate into new area
		- if current inhabitant is better than possible new point
			=> set to 'mute'
		- else
			=> add propagation point

	- only care about perimeter?

- GP2:
	- each cell is assigned to the best NCC score match group ID

- complicates MERGES of P3D ....

- how to 'choose' which is 'better'
- ncc?

- each group has:
	- id
	- perimeter cells
	- 
	- groups do not merge ... they only disappear when all seeds become extinct

- propagation by group only needs to happen at the most sparse level




- test moving some matches by 1 pixel and seeing what the differente wrt the camera base length is

debugInvestigationA

1 pixel difference:
0.01667
0.02620
0.02162
0.02116
0.0237

-> move one of the 2D positions until it is as close to the 3D neighborhood average as possible?
	- or average distance from camera at least ?



SUBDIVISION TESTS: subDivideUpdateMatchLocation - averagePointDistance:
-----------------
21@2 x1:
3.555
2.437
2.141
-----------------
41@2 x1:
1.664
1.263
1.005
-----------------
41@2 x2:
0.807
0.608
0.552
-----------------
41@4 x2:
1.306
0.946
0.777
-> 0.769
-----------------



- use higher resolution image
- have some poor matches -- big z-delta 
	=> need to try to drop those points
	- not necessarily OBSTRUCTING, but not near other points on surface (distance from camera is quite different)


--- nonlinear location best estimate is not very good 

- test with a made up altitude function & see if that helps?
- maybe do sqrt(f(x)) ?



was this part of it?:

world.setResolutionProcessingModeFromCountP3D([0,0,0]); // to highest




- new dataset --- & test stuff along the way

	- find places that take a long time
	- find places with poor accuracy

- why are final 3D results so fuzzy?
- way to do regularization?
	- average scale/rotation ?
		- after dropping outliers?


- try 2x location update on subdivision
	- 21 search pixels
	- 1/2 feature size search size 

	subDivideUpdateMatchLocation


solvePairF:
	- a lot of really bad point matches
		> why are bad ones being added?


solvePairF: 
	x a lot of really bad affines (visually)
	- some poor refined affines ?


DELTA A: 113 191 182 186 10996 17697    0 
DELTA B: 2917 1117 876 827 4106 1409    1 
DELTA C: 0  0  0  0  1564  0  0         3 
DELTA D: 397 432 392 632 704 653        2 



FEATURE SIZE | WINDOW SIZE | WINDOW MASK | WINDOW BLUR | AFFINE MODEL | ITERATION | SOURCE

.............................................
affine initialization:
	- permutations:
		- INITIAL AFFINE
			- initial match estimate
			- neighborhood points - rotation & affine
			- F rotation + initial scale estimate
		- FEATURE SIZE
			- effective average of features
			- 0.02
			- 0.05
		- REFINEMENT
			- visual 5x5
			- visual 7x7
			- visual 9x9
		- WINDOW BLURRING
			- none
			- 1 px
		- WINDOW (MASK)
			- square
			- circle
		- REFINMENT ALGORITHM
			- SAD (abs)
			- SAD normalized
			- SSD (abs)
			- SSD normalized
			- NCC
		- AFFINE MODEL
			- x+y directions (4 vars)
			- scale + rotation (2 vars)
		- IMPROVEMENT METHOD:
			- gradient descent
			- coordinated variable coverage with decreasing ranges ~ bisection
				- makes more sense w/ scale & rotation
		- IMAGE SOURCE
			- flat
			- gradient
			- other metric? (corners)?
.............................................

- 






- synthetic image tests of localizing methods
	- what is average & best sub-pixel accuracy

- allowing too many very poor F/R matches to continue into very poor tracks
	-> what metrics are allowing this to continue?
	(sparse)


- if 3D world is much bigger than image spacing ...
	- points at infinity will be very far away
	-> project everything beyond some ~ 1E9 distance from center (or camera location average center) to a sphere?

- 


http://localhost/web/ff/fourier/fourier.html

http://localhost/web/ff/images/localizing.html
http://localhost/web/ff/3DR/app/app.html?iterations=1
http://localhost/web/ff/3DR/app/app.html?mode=model


- with error the affine transform accuracy is > 1px [10 deg + 1.1 scale -> 2-3px]

	=> check what the affine accuracy is on patches
		-> visualize in-process example


function ImageMatScaled(image, scaler){
var images = ImageMat.getProgressiveScaledImage(image, scaler);


var halfA = imgA.getScaledImage(scaleMult,sigma, true); // #2 - blurrier


ImageMat.getBlurredImage = function(source,wid,hei, sigma){

gaussSize = Math.round(5.0 + sigma*3.0)*2+1;
	//gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma);
	gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma,null,   false, false);


gauss1D = ImageMat.getGaussianWindow(gaussSize,1, sigma,null,   false, false);

console.log(gauss1D);
console.log(Code.sum(gauss1D));





http://localhost/web/ff/fourier/fourier.html




- find out what time blockers are (sections of code, etc)


- theres some optimizing code in ImageMat where 3 colors could reuse many of the same variables
	- ImageMat.getBlurredImage




- 1D fourier series / synthesis
- 2D fourier series / synthesis
- fft
- fft 2D



http://localhost/web/ff/images/localizing.html


CUBIC:
0.16479184999427923 : pixels
LINEAR:
0.19223651128433522 : pixels



distance = 1/scale
	4.0 = 1/0.25;
	2.0 = 1/0.5;
	1.3 = 1/0.75;

...

what should sigma be for a scale of 0.25, 0.5, 0.75 ?
log()


sigma = exp(-x/d)


minimumFromValues


ImageMat.getProgressiveScaledImage = function(imageA, scaleMult, maxScales){



- need better coverage in low texture areas
	- 2D propagation must be failing in some capacity
		- visualize problem?
		- try using all (up to ~ 5 closest?) neighbors
- need better filter of bad seeds
	- depth discontinuities
	- non-regularization points
- 



filterCriteria2DNnot3DN - not filter much (~ 0.1%)





- could do 'sub pixel' by getting features at double size after search ?



- walk thru all steps of localizing a point

- try to get matches in featureless area


- F & R error don't seem correlated with actual points, instead locations IN IMAGE



- better filtering of points along depth discontinuities




 2d-3d & 3d-2d neighborhood consistency ?
 	- spherical consistency
 	- 3D location consistency


- re-check logic for probe3d dropping
	(pick/compare using NCC?)

- empty cell 3DR probing fxn ?
	- find empty cell (not next to any other cell)?
	- search for 2D point along F-line (in segments)
	- pick best score 2D point
	- if 2D point is far enough away from any other points (0.5-1.0 cell size distance)
		=> make as match & add







- what alg is used for SAD search?
	???


	optimumSADLocationSearchFlatRGB



- are there any off-by-one errors (eg on subdivide? / needle/haystack ?)
	optimumSADLocationSearchFlatRGB
		R3D.searchNeedleHaystackSADColor(needle,haystack);
		R3D.searchNeedleHaystackSADColorOffsetUnit(needle,haystack);
		R3D.minimumFromValues
			Code.extrema2DFloatInterpolate(peak, d0,d1,d2,d3,d4,d5,d6,d7,d8);


R3D.minimumFromValues - is scale correct in all cases : 



var scoreNCC = R3D.searchNeedleHaystackNCCColor(needle,haystack);
		scoreNCC = scoreNCC["value"][0];
	var scoreSAD = R3D.searchNeedleHaystackSADColor(needle,haystack);
		scoreSAD = scoreSAD["value"][0];
	var range = needle.range()["y"];




subdivideViewGridsR
	subdivideViewGrids
		cellSize
			initCells

				addViewProbePoint ???

probe2DCellsR
	probe2DCellsRF

		matchNeighborConsistentResolveAdd
	?????



optimumTriangleTextureImageAssignment
updateTextureVertexFromViews

 R3D.TextureVertex

useWorldGeometryIntersection

- check probe3d logic

- check refinePoint3DAbsoluteLocation logic


- add 'new' filtering to:
	solvePairF - sparse
		triple ?
	solvePair - dense
		triple ?
	solveGroup

	- tracks
		- can't load images
		- don't have error metric
		- 

solveDensePairNew


Stereopsis.js:1119 error 2 : 0.000016887081906093456 +/- 0.5977864870675872   (24104)
Stereopsis.js:3318 error 3 : 0.008574103650741953 +/- 0.545012130660828   (10563)
Stereopsis.js:3318 error 4 : 0.02533385677799459 +/- 0.5141729091648469   (5805)
Stereopsis.js:3318 error 5 : 0.05947135497365086 +/- 0.45182690452283936   (4089)
Stereopsis.js:3318 error 6 : 0.09636331132100047 +/- 0.37191773023396857   (3359)
Stereopsis.js:3318 error 7 : 0.06788098581934476 +/- 0.33864683515446503   (4149)
Stereopsis.js:11194 



- texturing triangles logic cleanup



- what else could increase accuracy of points ?
	- how bout DON'T optimize individual point locations?
	=> should all be accessible in GROUP logic

- maybe camera positions aren't quite right?
	- check by letting cameras move around

- maybe P3D location are optimized wrong?
	- check by not using point optimizer: refinePoint3DAbsoluteLocation





- go thru same sequence and see if issues arrise from changes
	- make sure visuals are used for intersection resolution
		- how does this work for sparse?
		- tracks?
		- dense?
		- groups?
	-use most expensive patch updating for pairs - soare & dense






solvePairF -=----------- inconsistent  compare



filterLocal2DF 



resolveIntersectionByDefault
	_resolveIntersectionDefault
		_resolveIntersectionLayered
		_resolveIntersectionLayered

pairs don't use visual combining - they only choose the best of the 2 options






SHOULD solvePairF === use R filtering ?



world.filterCriteria2DNnot3DN();

world.filterCriteria2DNnotDepth();

world.filterCriteria2DN3DNregularization();







filterCriteria2DNnot3DN still removes a LOT

- any algorithm that uses 3D neighbors needs to consider a CONE of neighbors

- plan algorithm for:
	- inconsistent neighbor (2DN but not 3DN) ---- find points that are in the wrong 3D location
		- drop this if worse than group average NCC
	- neighbor consistency (2D-3D & 3D-2D) ---- find points that are in the wrong 3D location
	- visibility - behind

- a spherical radius does not catch neighbors equally
	- surfaces normal to camera will be included
	- surfaces skew to camera will be too spread out

	- a neighbor can be anywhere within the cone of the ray to the pixel
		[possibly limited in depth to 0.5 to 2.0]

x f3d/bak filter of paper





neighborhood3DSize





- reassess subdivision logic
	subDivideUpdateMatchLocation



- filterCriteria2DNnotDepth - REMOVES A LOT & DOESNT ADD BACK



- problems with fuzzy points may not necessarily be just filtering
	- look at all steps & list out & summarize possible influence

solveDenseGroup...............

		- combining point logic (using images & best local location)

		world.setResolutionProcessingModeNonVisual();
		world.copyRelativeTransformsFromAbsolute();

			var points3DNew = App3DR.ProjectManager._worldPointFromSaves(world, groupPoints, WORLDVIEWSLOOKUP, true);
			world.initPoints3DLocation(points3DNew);
			world.initAllP3DPatches(points3DNew);
			world.initAffineFromP3DPatches(points3DNew);

		OPTIONS:
			setResolutionProcessingModeNonVisual

			x resolveIntersectionByPatchVisuals

			resolveIntersection
				_resolveIntersectionDefault

				_resolveIntersectionLayered

shouldUseNeedleHaystackIfImagesPresent
updatePoints3DErrors

				---- var shouldUseNeedleHaystackIfImagesPresent = false;

	=> NOT USING IMAGES TO RESOLVE POINT LOCATION ....



	..............................


- if the cameras are a little off, how can the filtering/positioning be forgiving?
	- use error% for volumes?


- TRY ALLOWING CAMERAS TO MOVE IN GROUP TO SEE IF THAT HELPS
	-> if it does help, how could groups be combined after an update?
		=> re-compute most likely average (rotation + scale + translation -> position)
		...





2nd filter:
	- for each P3D
		- for each P2D
			- for each 2D neighbor
				- if P3D is behind N3D for any view:
				mark view as not visible
		- if view count <=1
			=> mark P3D for delete




- 2DN not 3DN
	- what does opposit situation mean? - 3DN not 2DN?

	=> filterCriteria2DNnot3DN is removing a lot of points



- NOISY POINT CLOUDS
	- test in group in current test
	--- review stereopsis doc
		- double check filter algorithms
		- try out different methods
		- check out if dense pair is any different ?

- try a new set 360



=> FASTEST WAY TO CALCULATE A POINT'S 'SIZE' FROM SINGLE IMAGE
	- ray thru pixel p to P
	- ray thru pixel q
	- Q ~ closest point on ray q to P
	- know angle between 2 rays thru p & q & distance from camera to P => 

Accurate-Dense-and-Robust-Multi-View-Stereopsis.pdf


http://vision.ia.ac.cn/zh/senimar/reports/Accurate,%20Dense,%20and%20Robust.pdf

https://www.researchgate.net/profile/Yasutaka_Furukawa/publication/221364612_Accurate_Dense_and_Robust_Multi-View_Stereopsis/links/09e4150b67b605f515000000/Accurate-Dense-and-Robust-Multi-View-Stereopsis.pdf






photo-consistency

plane-sweep: for each depth plane : for each pixel : compute variance => pick depth for each pixel with lowest variance



NOTES:

occlusion: projected point from world to view-i may be obscured by another world point closer to view-i

on-expansion: find all other supporting views immediately?


- what are the differences/implications when considering ALL INCONSISTENT NEIGHBORS vs ALL NEIGHRBORS (2D) ? 




main papers:
https://www.di.ens.fr/willow/pdfscurrent/pami09a.pdf = http://openrs.whu.edu.cn/photogrammetry/2015/2008%20PAMI%20-%20Accurate,%20Dense,%20and%20Robust%20Multi-View%20Stereopsis.PDF
https://carlos-hernandez.org/papers/fnt_mvs_2015.pdf
https://www.researchgate.net/profile/Yasutaka_Furukawa/publication/221364612_Accurate_Dense_and_Robust_Multi-View_Stereopsis/links/09e4150b67b605f515000000/Accurate-Dense-and-Robust-Multi-View-Stereopsis.pdf

explainer:
http://vision.ia.ac.cn/zh/senimar/reports/Accurate,%20Dense,%20and%20Robust.pdf

visitied:
https://cs.brown.edu/courses/csci1430/2013/lectures/13.pdf
/Downloads/9781601988379-summary.pdf
https://courses.cs.washington.edu/courses/cse455/10wi/lectures/multiview.pdf
https://cs.nyu.edu/~fergus/teaching/vision_2012/6_Multiview_SfM.pdf
https://grail.cs.washington.edu/wp-content/uploads/2015/08/furukawa2010tim.pdf
https://www.cs.unc.edu/~lazebnik/spring11/lec16_multiview_stereo.pdf



todo:


- how to calculate the size of a 3D neighborhood?
	- neighborhood size for a single view is more accurate than:
	- neighborhood size average over many neighborhoods
	- when calculating a P3D patch size, save the 2D patch size = 4 projections L/R/U/D in the patch




- is updating K worth a try durning DENSE set ?
- how to average found Ks?


- TEXTURES
	- if certain parts of images are not used, they should not be considered for texture at all ()
	- store view data with points ?


- next solving problems:::::::::::::::::::::::::::::::::::::::::::::::
	- point clouds are still fairly noisy
		=> ?
		=> are the final group points optimized 3D location to improve 3D projection?
		=> usual methods:
			- filtering out obstructions
			- 
		=> higher resolution inages?
		=> more dense points ?
		=> predicted validity by projection to other views?
		- neighbors that are not where they are predicted to be are removed?
		- removing entire P3D vs removing a match?
		- enforce some 2D-3D regularization
		- P3D depth-only optimizing (3D point moves along ray to cameras?) ?=> DoF inside plane tho?
	- triangulations are missing some triangles
		=> ?
		... need to allow for more lenient assignment
			=> allow for triangle to face away?
				- add another penalty order of magnitude
				(is this even why points are dropped?)
	- textures from bad parts of images are being used (eg no intersection)
		=> ?
		- assigning view images to vertexes has problems, alternatives?
			- loading the individual optional images -- what is the best MEDIAN average image & make sure to drop outlier images / colors
				- candidate step where many images have to be loaded to check against (even at low res)
		- how to keep view data on the points ?
			- get point cloud of triangle size radius & get histogram of all views included
				- keep top







- make example app in unity
	- sketch scenes
	x how to make a triangle display at runtime?
	x mesh to use colors from an image
	x mesh rendered using lines
		- line renderer for single lines
		- opengl.lines for constant thickness lines
		- use triangle rendering to make flat/cylindrical lines
	x interact in 3D with buttons on tap
	x generate a circular mesh with desired colors
	x generate a circular UI with hexigons
	x generate spheres for intersecting 
	x color change ?
	x update visuals for when button click or whatnot
	- animation fade in/out colors
	- move 3D menu with player
	x render menu OVERLAY on top of world
		x new shader ?
	- show/hide screen
	- active vs inactive
	- event passed outward & show item at touch site
	- hook up event system to VR player controller
	- particle effects
	- shaders?
	- normal map?

	


- ARCHITECTURE MAKEUP: unity interface -> C# interface
	- overarching game object
		- input event system object -> relay to C# input system
		- 






x IMPLEMENT BACKGROUND SPHERE (after the fact even?)
	- which view to use ? most orthogonal ?


Tri3D.generateTetrahedraSphere
=> should connect the shared vertexes


- why is right-side of texture triangles square and left is rounded?






revisit keepExtendedMatchNeighborhoods

"remove too many negative"

optimizeSADAffineCorner


- if 2 views are ~ 180 deg apart -> probably a bad orientation



- test a large open-area scene (park)
- test BG-sphere
	-> output to PLY to test geometry
- 

- adding in phase to update camera parameters 
	- sparse group?
	- during separate dense
	-> how to combine?
		- average from separate dense pairs (averaged by error?)
			- cx, cy, s, fx, fy
			- does something need to be held constant (so that metrics don't float around)
				- eg: assume fx is best mapping
					-> scale all other values to keep this true
					-> don't touch fx

generateBackgroundSphere

- optimumTriangleTextureImageAssignment
	-> distance metric ?
		- sample the 3D space?

	-> average distance of a camera to it's content ?
	-> 



- world sigma size 
	- where are these triangles off in obivion


MOST RECENT TEXTURING PROBLEMS:
	- cost metrics might be bad?
	- poor geometry is ignoring some would-be intersections?
	- long triangles might not be intersecting geometry on the vertexes, but are intersecting in the triangle


- theres a couple of really big triangles????????????
=> are these off at infinity?




		// var textureDimension = 4096;
		var textureDimension = 2048;
		// var textureDimension = 1024;
		// var textureDimension = 512;
		// var resolutionScale = 0.50; // of maximum possible source input
		// var resolutionScale = 0.25;
// var resolutionScale = 1.0/8.0; // basic geometry test
var resolutionScale = 1.0/4.0; // debuging scene texture quality
// var resolutionScale = 1.0/2.0; // VR OK density
// var resolutionScale = 1.0; // release quality















triangle space volume: <3753931466.3444076,3753931466.3444076,3753931466.3444076>
R3D.js:37970 COM: <-0.667352050794305,-0.3881733462510339,2.6144062595238906>
655332390.6703029


655332390/3753931466 = 0.17


R3D.js:37749 1876965733.489034




- find list of views each vertex can use
- each triangle uses 3 vertexes to find subset of vertex union views
	=> drop impossible triangles
- each vertex than finds a subset of views that can be used from each of its triangles
	=>
=> keep final useable set




- texture assignment refined texture vertex assignment:
	- small offsets in image point projection mean 2D alignment needs some nonlinear update
	- frontier-triangles that need to do fading need to make sure 2D image projections match up nicely
	- EXACT 2D point projection can be determined:
		- after triangles are assigned
		- before fading/merging
	- need to load 2-3 textures at a time to do comparrison
	- pick view that has best score as known 2D coordinates (most-aligns with triangle normal / distance /...)
		- other 1-2 views search nearby area for optimum SAD match (1-2px or < 1 sigma R-error)
		- save all vertexes as KNOWN
		- for graph-cuts (med/low res):
			- need a second set of images for merged (boundary) trianges
			- assigned pixels of 1 triangle (edges) determine how pixels are assigned in adjacent triangles



 - 
 - find optimum choice triangles
 - add triangles/vertexes for optimum choice size
 	-> need re-
 	-> may be invalid vertexes


- possibly go back to triangle-focused algorithm that tries to limit cost including poor 'blocked' vertexes



each vertex has a list of projectable views

each tri has a list of possible view (union of 3 vertexes)

each vertex is then limited based on the triangles it is inside









searchMatchPointsPair3D

solveDensePairNew


- dense pair dropping - add back edges until triple exists: findConsistentLowErrorPairs / triplesFromBestPairs


- group bundle processing left behind a lot of noise points
	- local 3D group - drop points/matches from pairs (not entire point) that have higher Rerror than neighbors

- can group-bundle optimize 3D point to help reprojection error (not use DLT location)?


- silouetting of texture points
	iterateSurfaceProcess

	optimumTriangleTextureImageAssignment
	UpdateTextureVertexFromViews

	initAllowedViews








texture point mapping:
	- want to ignore views where vertex is blocked by triangle obstruction
	- want to use SOME LAST RESORT VIEW if vertex/triangle is found to be impossible
		=> tiered costs?
		-> each vertex has a cost for each view
		-> each tri is initted with lowest sum cost

	- a cost of an intersection existing is x 1E-10 some tiny number multiplier
	- a triangle cost is further multiplied by the triangle's geometry reletive to the view
	- the feathering cost should be happy with feathering to remove poor triangles





TEXTURE TRIANGLE/VERTEX ASSIGNMENT:
	x each vertex: get prioritized list of possible view sources:
		- normals within ~ 90 degrees
		- direction within ~ 90 degrees
		- projects to inside image
		- score:
			- distance to view
			- normal angle
			- triangle geometry intersection
	x assign each vertex to the best score
	- add each vertex to a queue based on delta-cost
	- delta-cost: vertex
		- max(0,current cost - next best cost (nbc))
			- nbc = sum of all triangles costs at view assigment i
	- while a vertex exists that can reduce cost:
		- change vertex to new assignment
		- add all connected triangle's into queue (& recalc nbc)

		- triangle splitting:
			...




	- while a triangle exists that can reduce cost (reduce the most?):
		- reduce the triangle's cost
			- 


UpdateTextureVertexFromViews














- metrics for poor affine
	- backwards affine? CCW vs CW X->Y direction?


- RIFT scores are poorer than flat-SAD scores
	=> is there some error in rfits?

=> GO BACK AND CHECK PERFORMANCES FOR: generateProgressiveRIFTObjects
	- check if default 4x scale for corners is optimum ...
	- neighborhood






generateProgressiveRIFTObjects

	progressiveR3DSizing2











x pass along reprojection error sigma to dense pair candidates
	x some pairs may not have the relative error to use
	=> assume some low number, max tolerable, eg < 1% = 5px @ 500px


x maximum suppression top points
x make haystack only a few features wide (1/5 to 1/10 the hypotenuse)
x iterate on haystacks to collect top points
x get RIFT samples of top up-to-10 candidates
- get initial RIFT samples of corners
x compare candidates
x keep top 2 matches & scores

- do a->b & b->a loop

- choose top matches:
	- top score ratios > 0.7-0.9
	- compare a&b points
	- keep 
 
 - filter on:
 	- match score
 	- F error
 	- R error






- DENSE MATCH SEARCHING
	- use corners as starting points
	- search along F-line
	- affine is determined from projected 
	- localize for higher accuracy after corners are found/compared
		- exact location may land closer to another point
	- comparrison method?
		- normalized RGB SAD
	- compare tiering:
		- low-quality (blurred) (eg 5x5 or 7x7) - ignore some 50% ?
		- high-quality (eg 9x9 11x11) - choose top 2
	- A->B & B->A best matches ?
	- accurately localize final match points

	- neighborhood validation?


- DENSE - LONG-HAYSTACK MATCHING
	- 


x DENSE PAIR PUTATIVES (geometric & graph based)
	- track point info (overlaps)

	- display edges

densePutativePairsFromPointList



- PUTATIVE DENSE PAIR CANDIDATES (graph only)
	- use 'final' sparse edges
	- keep top 2-3 choices [from original sparse edge set]
	- find 2-3 neighborhood pairs & order all remainder based on error
	- keep remaining top 1-2 choices [from remaining original sparse PLUS putative set]
	- use connectivity-enforcing algorithm with final remainder
		- top 3-5 best view edges
		- min 2-3 triples per view





COMPARING 2 R-DENSE METHODS:
	A) corner-corner
		- 2000 pts A & 2000 pts B
		- get F-line candidates
		- F-line: 50 candidates
			- 3D point
			- affine
			- extract
			- compare
		- top candidates: 10
			- RIFT extract + compare + rank
	B) corner-line-point
		- 2000 pts A & 2000 pts B
		- 5-10 checks > ~ 50 points
			- 3D point
			- affine
			- extract (1 large 1 small)
			- compare
		- top candidates: 10
			- RIFT extract + compare + rank
		- F-line: 50 top points


OPERATIONS:
	A) 2000 * (50 + 10) = 120000
	B) 2000 * (10 * (1.5) + 10) = 50000
	=> expected about 2x as fast







- WHEN ARE LOW-CONTRAST AREAS EXPANDED INTO?
	- allow to pick points near more-confident locations that are consistent with R & F w/ minimal (no) checks
	- DYNAMIC-SIZED-FEATURES








-- IS THIS TESTED/DONE?: optimizePatchNonlinearImages

- pair sparse very slow




PROBLEMS:
	- BACKWARDS:
		A: "TD6NYI6O"
		B: "R0HIACB5"
		all 1000 points from F reversed R
	- is rabbit sequence missing a triple (pair) for triple-connectivity completeness?
		- R0HIACB5-TD6NYI6O


- SPARSE BA does SKELETON SET (eg 7 of 11 views & 7 pairs)
-> THEN FULL SET: 11

- SPARSE BA IS missing
		id: "7G51V6GZ"
		deltaErrorR: 0
		errorR: 0
		updated: 1610509740324
		count: 1713

		track3AverageError -- only works if tracks are merged
		>>> O NO VALIDATION FOR TRACK P

// console.log("UNDO NO VALIDATION FOR TRACK POINTS 2");
				world.embedPoints3D(additionalPoints); // TODO: ADD THIS BACK
// world.embedPoints3DNoValidation(additionalPoints); // TODO: REMOVE THIS


App3DR.js:12068  maxErrorFInitPixels: 63
App3DR.js:12068  maxErrorFDensePixels: 25.2
App3DR.js:12069  maxErrorFTrackPixels: 12.6
App3DR.js:12070  maxErrorRTrackPixels: 12.6
App3DR.js:12071  minimumCountFInit: 20





- sizes A & B are the same --- the extraction size in EITHER IMAGE after the transform (identity or affine match)

- STEPS F:
	- FEATURE - SCALE + ROTATION UNKNOWN FULL MATCH [1k-2k] 		guess features [splotchy]
	- RANSAC MATCHING FEATURES [100-500] 							guess F, best features
	- CONSISTENT NEIGHBORHOOD FEATURES [100-400] 					best features
	- NEIGHBORHOOD BEST MATCH FEATURES [100-200] 					increase features
	=> from corner to PRECISE PIXEL LOCATION?
	- RANSAC NEIGHBORHOOD FEATURES [100-200] 						better F, best features
	- 


- STEPS R:
	- F-LINE MATCHES, GOOD AFFINE [1k-2k] 							good guess features [good spread]
		- search neighborhood for exact location
	- RANSAC MATCHING [500-1000] 									better F, best features
	- CONSISTENT NEIGHBORHOOD [500-1000] 							best features
	- NEIGHBORHOOD? [1k-2k]
	- RANSAC NEIGHBORHOOD [500-1000]



- try neighborhood accuracy based on 8-neighbor guesses
	- compare 1:1 x 8-9 scores
	- filter nighborhoods on average score
		-> poor:
			- bad affine
			- bad location in general
			...
- faster way to do compare of neighborhoods ...
-> call comparing fxn once ?





[1:2 -> 1:3]

- getting affine match not very reliable ...
	- try other methods?
		- use F for rotation & do only iteritive scale?
		- do iteritive angle/scale or vx,vy,ux,uy space?
	- ...





- ALREADY HAVE NEIGHBORHOOD SEARCH?


- try previous neighborhood method












- HAVE INITIAL F / MATCHES SEEDS (ERROR)
- INCREASE SUPPORT:
	- neighborhood seed search
		- use corner points -- original points (not necessarily size/rotation)
		- for each seed point (= neighborhood):
			- estimate best affine rotation/scale match
			- find matches in opposite assuming affine transform & search window
			- keep only matches that match fwd<->bak
		- compare neighborhoods:
			- neighborhood score = average match score * (successful match ratio)  (different windows may have different possible corner count & success)
			- drop neighborhoods with >2sigma scores
		- compare final points:
			- drop scores > 2sigma
		- update F
			- drop points > 2-3sigma error
		- update F
- DENSE F:
	- use world to explore / expand from seed points



- start case study process again - using udpated/new algorithms
	- upload rabbit sequence
	- image histogram & lexicon
	- generation of pair set from graph algorithm
	- pair sparse matches
		=> observe errors
- generating dense pair set:
	- use pair set from graph algorithm
	- is more or less pairs better & how to estimate?
		- direct vs indirect neighbor ... w/ or w/o similarity metric ?
		- 
		=> initial, compared first set might have some bad matches in it, and might have missed some good matches
			- calculate minimum path to 2-3 neigbor vertexes
			- effective score:
				(total path cost error) x (indirectness)
				-----------------
				()

		- START WITH 1 - BEST MATCHES
		- ADD UNTIL 3-triple minimum & continuous
			=> how to handle possible disconnected graph?







- what would make a very high confident match is if L/R/U/D neighbors also were good matches (assuming same local affine transform)
-> dense F matching chould use angle/scale neighborhood before picking as a good match



- initial fat (oblivious) feature matches => 20-50 matches @ 1-10 F error
- f-aligned feature matches => 50-100 1-2 F error, 1-5px abs error
- best matching neighbor searches => 100-1000 seed points @ 1-2px abs error


- blob points rather than corner points may be better for image bag of words
	- nonoriented

- normalized COLOR HISTOGRAM (take out intensity?)
	- project onto plane perpendicular to 1,1,1 @ 0.5,0.5,0.5 ??
	- HSV & ignore | make less important Value : (divide by sigma?) value


- IMAGE CANDIDATE STEPS:
	- image histogram
	- unoriented features
		- BLOBs (@ 2x)
			- extract rect @ 11x11=121 -> 31x31=961 (& circular mask)
	- oriented features (@ 2x)
		- decide on metric:
			- un-normalized flat RGB image
			- normalized flat RGB image
			- groups of RGB histograms
	- scores:
		- histogram: SAD
		- features: 
			- image A features find best score in image B
			- order scores & get sigma distribution
			-> sigma/count = metric
				-> abs-sigma metric ?
			-> CDF metric ? (avg slope ?)
	- choosing
		- compare images to limit to ~ 25
		- compare unoriented features to limit to ~ 10
		- compare oriented features to pick top 5?

















.............................................
- IMAGE CANDIDATE MATCHING
	-> using bag of words to get best features
		- image:
			- overall color histogram? [to limit top ~ 10 matches]
		- corner:
			- color histogram (undirectional) - ok to narrow, bad for compare
			- grouped color histogram - good to keep non-specific
			- flat histogram - may be too specific
			- gradient binning - may be too specific
	=> specific/exact matches are not so important
		- gradient/corner
	=> larger area-coverage important
	=> perspective changes important
	=> lighting changes important (lighter/darker)

	=>>>>> PROCESS
		- get image color 
		- get 100-500 top corner points

=> maybe don't care if has TOP matches, maybe just care if ANY good matches
	=> repeated structure is OK
=> histogram of top match scores (sum?)

=> only care if parts of histogram are good?

-> get corners
-> get directions
-> get expanded sized features (2-4 as big)
-> extract features
-> each image: compare histograms
-> each image: choose up to top 10 opposite images for consideration
-> each image: compare features with other
-> each image: rank based on histogram of top scores (get sigma)




F) dense point matching using F - stereopsis



- color-space histogram (unoriented)
- SAD-color compare (OFFSET+SIGMA) (blurrier to allow some error)
- 
- spatial grayscale gradient histogram
- colorspace gradient histogram????
- 2D directional color-gradient (point in 2D direction of largest change / COM of neighbors)
- 3D directional color-gradient (3D direction of net avg color change of neighbors)

SIFT = binning of binning [gradient angle binning + pixel-group binning]





2D-flat :  5x5=25 to 9x9=81 color compares
2D-c-max:  16x16=> 4x4 angle histogram of max-change direction (angle @ magnitude)
3D-color:  16x16=> 4x4 solid-angle histogram of net color change to neighbors




R3D.colorGradientFeaturesFromImage = function(imageScales){

var objectsA = R3D.generateProgressiveSIFTObjects(featuresA, imageMatrixA);




var result = R3D.progressiveMatchingAllSteps(imageMatrixA,objectsA, imageMatrixB,objectsB);

		var result = R3D.progressiveFullMatchingDense(objectsA, imageMatrixA, objectsB, imageMatrixB);





- COULD A HISTOGRAM BE COMPARED BASED ON COM+OFFSET+NORM rather than ABSOLUTE histogram?
	[light vs dark?]
	- 3D 'distance' from center blob 
		A) 
			- get data COM & sigma
			- volume of cube is ~ 2 sigma
			- divide up space into equal cube [5^3 = 125, 7^3 = 343, 9^3 = 729]
			- points outside cube are ignored
			- points inside cube are rounded to nearest center-cube location
				- make sure lattice is setup correctly



		object["9x9_histogram"] = R3D._progressiveR3DColorHistogram(blur9);
	// grayscale SIFT
		object["9x9_SIFT_gray"] = R3D._progressiveR3DGrayscaleSIFTList(blur9);
	// color SIFT
		object["9x9_SIFT_color"] = R3D._progressiveR3DColorSIFTList(blur9);



var features = R3D.differentialCornersForImage(imageScales, new V2D(600,400));
	var normalizedFeatures = R3D.normalizeSIFTObjects(features, imageMatrix.width(), imageMatrix.height());




var normalizedFeatures = R3D.normalizeSIFTObjects(features, imageMatrix.width(), imageMatrix.height());





COMPARE METRICS:
	- 2D GRAY SIFT
	- 2D 3x R,G,B SIFT LIST
	- 2D SAD+OFFSET+NORM








findLocalSupportingCornerMatches
	- is 2D affine correct
	- is image extraction correct 
	- re-check this metric:
	var compareImagesFxn = R3D._progressiveCompare2DArrayV3DSADClosestSingle;
		x convert from BEST-SAD to: SAD-OFFSET-NORMALIZE-BEST


- point peak scale optimizing
	- only need to calc COM-ANG & MAG at single pixel (5x5 / neighborhood)



R3D.imageCornersDifferential = function(image, whatelse, testPoint){

- change score metric used for feature matching






- when averaging vectors, do so based on magnitudes

- a pixel's score = based on how quickely it's neighbors change angle






CORNERS
	directional color-gradient:
		- gets LINES
		- direction is unstable equilibrium [little to left or right is opposite gradient]




- peaks of corner-score field are on inside & outside of line
=> select only diverging (inside corner) points
	x convert angle field to vector field
	x average vector field (angle) to smooth out thing (+/-)
	x each pixel score is then multiplied by div/conv-ergence factor:
		- look at left/right neighbor (orthogonal to COM line)
		- converging line scores go down
		- diverging line scores go up



=> pick maximums in this field 





CORNER STEPS (used):
- blur source image ~ 1 px to remove noise
- get corner values: COM (averaging local color differences) => angle direction & difference magnitude
- filter COM direction with neighbors to remove noise (use consistent directions)
- create divergent field values: threshold on positive (+delta) angles
- remove values that don't pass divergent field
- find peaks in difference field
















R3D.progressiveMatchingAllSteps
	var result = R3D.findLocalSupportingCornerMatches(imageMatrixA,imageMatrixB, pointsA,pointsB);
solvePairF


gd_SAD_IMAGES

R3D.optimizeSADAffineCorner
	=> should this use average offset too?



x try extracting 2 separate images (except at ends):
	- floor(scale)
	- ceil(scale)
	- average result based on percent
		=> pass in constant scale factor

	=> test in a range-zoom method

	=> test in an entropy method


write out location/compare algorithms:
	- data: gray / color
	- data: flat / grad
	- SAD
	- SSD
	- CC / NCC
	- grad

write out affine algorithms:
	rot/ang

	x/y vector

	exhaustive

	lattice exhaustive




- matching: flat areas are important, but edges more so?




VALIDATE EACH STEP/ALG WITH TEST PAGES


x matching expected location in 2 different images

- matching expected transform in same image (distorted version of same image)

- matching expected transform in 2 different images

- patch (3D cameras)?

- finding local matches around point (assuming similar rotation/angle/affine)




- look at entropy extraction again?



=> add regulatization by using F/R estimated location rather than just corner peak ?





- not tested yet: local matches from match -- is angle/etc respected?



- image extraction: center & affine

- corner points
- corner peaks
- corner scale & rotation

- image comparison & alignment optimizing
- peak localization

- patch alignment

- seed matching
- increase local matches using seed

- known R matcher



VALIDATE:

optimizePatchNonlinearImages
_optimizePatchNonlinearImagesGD





optimizePatchSizeProjected



- need to get a list of all major algoritms and metrics & have tests for each to make sure they're doing as expected

...







var newMatch = world.bestNeedleHaystackMatchFromLocation(centerA,centerB, newPointA, affine, viewA,viewB);



- large R error
	- some bad (flat) points being expanded to for F step


- optimizeSADAffineCorner
	- optimizing affine matrixes not working
	- error metric?
	- blurring?
	- ...






- some poor 'flat' matches -> should match error take into account RANGE ?
- SAD error / range

errorNCC\([a-z]+\)


..


calculatePairMatchFromViewIDs












why is this also used?;

optimizePatchNonlinearImagesGD



SLOW: "CALCULATE F -> P"

x R3D.optimumSADLocationSearchFlatRGB
x minimumFromValues



- do small image group: ~ 10 & look at algorithm performance again
	- try to optimize slow things
	- when pair / group matches are bad : find what parts of algorithm may be bad (eg point localization)

- blind initial best pair guessing
	- drop worst 50% histogram ones?
	- area-histogram matches ?






- track group & full looks horrible
	x don't do intersection resolution when aggregating points?
	- nonlinear error fxn?


- start replacing slower code with newer code
	- make some test examples first
	- compare old & new algorithm: results & performance
	x A)
		- extract a section out of an A-B pair
	- B) 
		- feature extraction show





objectProgressiveR3D
	var object = R3D.objectProgressiveR3D_Z(point,imageMatrixScales, cellSize, matrix, debug);
		progressiveR3DFlat
	R3D.objectProgressiveR3D_1(object);

		object["9x9_histogram"] = R3D._progressiveR3DColorHistogram(blur9);
	// grayscale SIFT
		object["9x9_SIFT_gray"] = R3D._progressiveR3DGrayscaleSIFTList(blur9);
	// color SIFT
		object["9x9_SIFT_color"] = R3D._progressiveR3DColorSIFTList(blur9);





TEST:

R3D.optimizeSADAffineCorner

R3D.optimizeMatchingRotationScale















50x @ 5
25x @ 11
12x @ 21
7x @ 41
6x @ 81



- affine-to-sub-image algorithm
	- local affine to total affine (position included)
	- testing

- change over affine-to-sub-image algorithm






- test some speedups
	- linear interpolate vs cubic interpolate image
		- not big difference: 240/260
	- imagescales w/o doing padding & gaussian process

	- reuse of variables more
	- is homography needed ?
	....



OPTIMIZATIONS:
	- reuse objects (no new)
	- fewer function stack calls
	- cache data that will be reused



ImageMatScaled.prototype.extractRect

ImageMat.extractRectFromFloatImage = function(x,y,scale,sigma, w,h, imgSource,imgWid,imgHei, matrix){


extractRectWithProjection

ImageMat.extractRectWithProjection = function(source,sW,sH, wid,hei, projection, interpolationType){ // projection is 3x3 Matrix





- some near-pairs with initial Rs are very bad
	-> are the Rs inaccurate?
		-> EG: 1PYE10VZ-7PIQPNWP







- dense putative pairs should use geometry in addition to graph connections to decide which to use
	- connected by eg two edges may be OK, but still a huge rotation
	- ...



- in general: need more coverage across neighbors in order for triples to be any use

- try score with histogram & words:
	histogram = difference (smaller better)
	words = similarity (larger better)

	similarity / word count


TEST:
- try nearest +/- 3 neighbors in sequence (mod length)




- could dense use the initial graph to iteritively pick pairs on-the-fly rather than coming up with them all at once
	- start at some node, continue to connect to more as pairs are made
	- once some coverage (duplicate paths) are made, can stop making more pairs in area...




	-
		A: "F58HBCHH"
		B: "4EAACP4W"
		id: "4EAACP4W-F58HBCHH"
		matches: 0
		relative: 0
		tracks: 0



		A: "F58HBCHH"
		B: "01IOZ488"
		id: "01IOZ488-F58HBCHH"
		matches: 0
		relative: 0
		tracks: 0
		metricNeighborsToWorld: null









R3D.showRelativeCameras



- initial estimate has lots of points behind camera
- point matches seem fairly good
	- some incorrect matches
	- F sigma: ~ 5
	=> linear P is putting cameras on wrong sides
-
	=> check P nonlinear steps
	=> RANSAC



R3D.transformCameraExtrinsicNonlinear
transformCameraExtrinsicNonlinearGD








ALGORITHM IDEAS:

	
A) exhaustive sphere
	- keep cameras pointed in same direction
	- pick 32-100 points on unit sphere:
		- for each location calculate score
			- score = (only points in front): reprojection error / point count
	- pick location with best score
	- do nonlinear step




- initial P - nonlinear flips a bunch of points to behind
	- A) is the linear step right or wrong?
		- print out overhead view & locations of points & views
		=> it's left-right directional correct
	- B) is nonlinear step right or wrong
		- " ^ "
		=> it's left-right directional correct
	- 

	
	->


remove too many negative ::::::::::::::
	{A: "AF1MYLKE", B: "U37EIKSI"}
	-
			A: "2183ZM7R"
			B: "LSHY05RW"


---- this is removing some very good matches -- close to center-center 




55 reachable of 108






- pre-graph abs generating: show circular connected components (known relative scales/transforms)











Stereopsis.ransacTransformF


P = R3D.transformFromFundamental(bestPointsA, bestPointsB, F, Ka,KaInv, Kb,KbInv, null, force, true);



R3D.showRelativeCameras(A,B, bestPointsA,bestPointsB);





- initial pair estimates:
	- can the words + histograms be combined:
		A) user histogram to rule out obviously bad groups [eg sub 50%]
		B) combine (multiply) word score (match count) by histogram score (differences)




MISSING VALID (& GOOD) PAIRS:
-
		A: "3SRZ7XFK"
		B: "RGIGDTLL"
-
		A: "2183ZM7R"
		B: "LSHY05RW"
		












x view similarity poor
	~ 60 words on average
	~ 80-90 words on average []



	- fuzzy group points
		- add more BA iterations beforehand? (get camera positions more exact)
		- (dense & group) drop any points with reprojection error > 1px

		=> change search window to disallow fewer candidates?
			- probe3d & probe2d

		=> more refinement / dropping steps after probing
		(~2 iterations of only camera update and dropping)

		- add BA all-views optimization step at end of BA steps


	- groups/pairs not propagating into blank areas (may need guidance?)
		- use a predicted R/F location 

	- SLOW
		- spots that could be sped up by reusing objects (no NEW), or caching?
		- 


	- 2D-3D neighbor filtering logic may need to be altered for groups:
		- % in 2D or 3D area may be low (not accounted for in THIS pair)
		- numbers should only be based on shared points & not global points
		- eg: if only 10% of 2D points in area are THIS pair matches, should not expect more than 10% in 3D points in volume



- BP find example factor graph (markov field) to check algorithm against





	





	- factor graphs & inference algorithm - bayesian network -> factor graph
	- max-product walkthru



- sparse step needs views in root of file (not under putative)


- sphere projection after surface triangles are made
	Tri3D.generateTetrahedraSphere(radius, subdivisions, offset)
		- after triangulation is made:
		- create sphere: centered at view centroid, extent = ~ 100x point (or triangle) 2-3 sigma 
		- decide on some sphere triangle density (100-1k-10k triangles)
			=> method to create triangle sphere
		- for each vertex on sphere:
			...
			vector from camera center to 
			- facing camera normal?
			- point projects to inside of image
			- not intersecting with world triangle geometry
			- 
			...
		- drop triangles with any no-view-vertexes





- dense groups are a lot more fuzzy than dense pairs

- triangles generated produce a nonorientable surface
- if points were pointing in direction of normal, that would be more accurate on a per-triangle basis
- is there a way to do more-confident to less-confident (assuming smoothness/regularization) ?



.............






- is filter 2D & 3D neighbors is resulting in more points dropped



- TEXTURE ASSIGNMENT PROBLEM:
	- some vertexes aren't visible, or not visible by some views when it would be in reality
		- caused by:
			- A) noisy geomtetry
			- B) vertex isn't visible, but part of triangle is

	REAL VISIBILITY:
		- any part of triangle is visible from view

	REAL TEST:
		- project all triangles in-front of subject (average z-distance) onto view's plane
		- if there is a triangle cover / intersect:
			- drop occluded portion
			- can stop immediately if fully covered
		- if any part of triangle still exists (some but not full covering):
			- all vertexes of triangle are visible, but with some penalty:
			- eg: % of area occluded (0-1)
		- if all of triangle still exists (no covering)
			- triangle is fully visible
			- all vertexes of triangle confident

	SIMPLE VISIBILITY:
		- check vertexes only:
			- vertex is on any triangle with normal facing view normal
			- vertex isn't occluded by a 













- solveDenseGroup fewer points:
	- neighbor filters drop a lot of points
	- groups have fuzzying surfaces
	=> last step of bundle adjustment should do ALL VIEWS at same time ?




- why is F still picking points behind ?
	- critical pair ?
		- minimal translation compared to scene size ?
		- distance to points is >> distance between camera centers
			~ approx 0 translation
			=> what do do with nonlinear updates?

		checkPointsLocation -- are the far points much farther (1000x?) than center-distances

		- a single very far point can throw off average ?
		=> 2-3 sigma distance dropping until stable group

refineAllCameraMultiViewTriangulation

- points at infinity - sphere projection




- semi-dense corners are not reproducible across images ?
	=> dropped this step

progressiveMatchingAllSteps -- final matches are not used matches ?
	GOOD: findLocalSupportingCornerMatches
	>>>: findDenseCornerFMatches



- matches being made on opposite side of F line ?

- expanding probe2DF out to very bad locations


- error N / S calculation MEAN v MIN


- exact duplicate image check
	- filter on very high histogram [99%+]
	- load each remaining potential image
		- 
- near-duplicate image check ?
	- ignore lighting change
	- ignore tiny rotations / scale / offset
	=> how to detect these ?





TASKS:
	- 3DR:
		- display putative edges
		- probe3D
		- patch filter
	- BP:
		- outline factor graph (from doc)
		- start factor graph (from example code)
	- 







POINTS AT INFINITY:
	- sphere
	- for each tri in sphere
		- find most direct view that doesn't have intersection with world geometry
		- add sphere to triangulated points @ distance ~ 100 x average world size




























- simulated example loop filtering


- bayesian network
- what is solved for in general ? joint probability queries
- what is solved for in loops => list of xe = 0 for correct, 1 for incorrect

- data:
	- xe has some % confidence in it's individual Te
		- can be a sigma % of global Te reprojection error
			=> population = all edges in view graph's reprojection error
				- assume half-normal distirbution
				- get min, sigma
				- get percent = normalized sigma location from center
					=> from cdf -> calculated table ...
				=> P(Te | xe) / P(Te) = confidence Te is a good transform
					0 : 1 - percent 	[eg = 1 sigma: 100%-68% = 32%]
					1 : percent 		[eg = 1 sigma: 68%]
	- xe has some % confidence for all listed loops:
		- can be a sigma % of global loop error
		- can be a sigma % of neighborhood loop error
			=> population = all loops in view graph's average angle error
				- assume half-normal distribution
				- get min, sigma
				- get percent from sigma ratio / cdf
				=> P(TLerror | xe in L)

	=> max arg:
		[P(x_i)] x [P(TLerror | xl)]

P table for each xe: sigma percent [eg]
0 : 0.60 (not confident)
1 : 0.40 

P table for each loop?:

x0 x1 x2 : 
0  0  0  .
0  0  1  .
0  1  0  .
0  1  1  .
1  0  0  .
1  0  1  .
1  1  0  .
1  1  1  .


condition on evidence
query is RV of interest
P(query | evidence)

P(X0=x0, X1=x1, ... Xn-1=xn-1 | transform confidences, loop confidences)


P(xe) = confidence in Te ?
P(Te | xe) = ?
	- 


EXAMPLE BAYES TO CHECK AGAINST:
notas_de_aula_Parte9.pdf











- should exp. dist. be used in other places (other p point error ? or view or pair ...)



=> total actual error is very low: 1-10 degrees
=> maybe more extreme transforms can be more lenient on error:
	eg: relative error:
		a matrix that rotates 90 deg but has 1 deg of error is better than
		a matrix that rotates 10 deg but has 1 deg of error




http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.613.6464&rep=rep1&type=pdf


http://andrewowens.com/papers/disco13pami.pdf


https://towardsdatascience.com/belief-propagation-in-bayesian-networks-29f51fdc839c




https://papers.nips.cc/paper/1832-generalized-belief-propagation.pdf









- new sequence:
	- want 180 + deg test (360?)
		- fairly simple geometry
		- no reflective surfaces - only matte
	- 15-20 images
	- sparse pairs can have lower res (1/4 ?)	=> still need to have good amount of tracks

	- before triple: identify bad pairs => reassign relative/tracks to 0
		- RAW R ERROR
		- ROTATION ERROR
		- INFERENCE / LOOP ERROR

	- init graph: check for inconsistent pairs again
		- ?

	- dense putative pairs: use geometry as well as graph for candidates
	- dense pairs can have little lower res (1/2)
	- group - probe 3D
	- group - probe 2D
	- group - filter patches
	- detect when subdivide / quit, not just constant iterations


- do dense points at half resolution 200k pts -> 50k pts








Bayesian Network

Belief Propagation







http://www1.maths.lth.se/matematiklth/vision/publdb/reports/pdf/enqvist-kahl-etal-wovcnnc-11.pdf
http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.613.6464&rep=rep1&type=pdf

4032 x 3024 @ 100
2016 x 1512 @ 50




- every so often loadPoints takes a while
LOAD POINTS: 191584
Code.unpadArray2DLinear


LOAD POINTS: 463205
[0, 0, 55674, 30297, 23758, 20121, 12672, 6784]
149306





TODO: store view's track average point location + sigma distance for sparse->dense putative matching phase




initializeSurfaceFromBundle -- has some memory peaking: copying view/point bundle data to surface data
	- binary iterating
	- yaml parsing




how does a triangle know which views it is visible from?
- with duplicated / overlapping group points: points may be visible from other views but not recorded on point itself



- 3D surfaces -> what about projection of image / wrapping as texture ?




- not sure how to load 'only 3+ tracks'
	- need to keep all tracks until all are loaded

 - not sure how to resolve possible drift:
	go thru each group: ?????????
		- optimize each view in group (3+ tracks), save result view outside of group
		[overlapping views get optimized multiple times]


PEAK MEMORY USAGE SITUATIONS:

	SPARSE: world-solve
		assume all tracks from all views can fit into memory

	DENSE: world-solve
		assume all 3+ tracks from all views can fit into memory

	BUNDLE-GROUP: group-solve
		assume all dense points of K views + images can fit into memory

	SURFACE: short term (sub 1E9 3Dpoints)
		store all 3D dense points + normals & triangles in memory

	SURFACE:
		store all triangles in memory





- check how sparse-> dense putative pairs is done
	- graph selection
	- 3D geometry relative orientations
		- relative distances
		- relative rotations
		-> how to determine common visibility
			- near / far / ...
	- start with MST to guarantee connectivity first

	- dense has too many pairs (too much repetitive overlap)
		- can't go below 2








- full BA should include fewer pairs to reduce processing?



- combine group track loading + full track loading logic








............. if a transform has a bunch of poor matches:
	- need to identify 'most failing' view & reposition:
		- get a P from each existing transform
		- get average new location
	=> how does this behave in a multi-problematic scenario?
		- 


with the case of TRACKS:
	- confident that at least 50% of the matches are good (in fact nearly 100% are good, and are +z when chosen)
	- for multi-view scenario: 
	- if any transform's points are all (50%+) behind it, the view is in an incorrect position and should be updated:
		- move view to COM of points (move in -normal direction to Z)
		- CAN'T move to behind all points

	=> which view to move, and where to move it to?

		=> nonlinear method just like reprojection error, but only optimizes moving points to in-front
			-> cameras that don't contribute won't change their variables



=> TRY:
	- move transforms in directions that more agree with desired P
		=> calculate P from transform pair
		=> scale P up to current baseline
		=> update each absolute position based on average of edges
			=> solve absolute transforms




...............

error metric: what matters most is DELTAS
	=> want to 'push' cameras into place
- 'how far behind' views a point3D is
- reprojection error 




0th view is in wrong spot
=> need the reprojection error to cause camera to move backwards

	=> need to avoid local minimum


=> if some % of points are behind cameras -- cameras need to rotate
	=> distance behind camera matters then
..........

....







var result = R3D.optimizeAllCameraExtrinsicDLTNonlinear
	transformCameraAllExtrinsicDLTNonlinearGD



- single view optimizing is really bad
- multi view doesn't get to a very optimum minimum location

- initialization may be off ??? 
	- it doesn't look as good as hoped


- try not combining tracks  ?

x try changing weights on graph calculation (to 1) to see if result is different



solveOptimizeSingleView
	=> looks bad

		refineSelectCameraMultiViewTriangulation
		optimizeMultipleCameraExtrinsicDLTNonlinear

	=> could try 'optimize every view' for possibilty


- intersection tracks?
- R3D optimizing fxn?





refineAllCameraMultiViewTriangulation





optimizeAllCameraExtrinsicDLTNonlinear ............
















OPTIMIZING & COMBINING
	- graph.yaml has all original view transforms
	- track_i.yaml has optimized group view transforms
	=> at combine:




- HOW DOES COMBINE AFTER SKELETON WORK?
	- scales may have drifted

	=> keep track of original vs new view orientations (distances)
	- inverse absolute scale of group by change in scale (average of all baseline camera distances)
	- have to re-combine using geometry graph

	x> do point-loading to get average scale difference ?
		- have to exist overlapping points (and many) to get estimate on relative distances
	
	=> ?






PIPELINE STEPS AGAIN:
	x get absolute graph from pair & triple relative scales
	x separate view graph into: groups (4-8) and skeleton (MSP)
	x optimize groups & skeletion individually
		x A) load tracks
		x B) optimize view orientations (points change too)
	- combine groups & skeleton into single graph again
		- invert each group's scale by inverse of average scale change (previous/current)
		- pairwise orientation solve for every pair in group with minimum count of 
	- optimize all views at same time
		- load tracks
		- optimize views (points change too)
	- 








- relative scale are inconsistent on different runs
	-> there is no stable scale in ratios (not a fairly flat area)

- need to identify bad pairs (and/or triples)
	- reprojection error isn't useful
	TRIPLES:
		- unstable ratios (sigma of scale >> ~ 1%)
	PAIRS:
		- 3D sigma very single direction (of camera Z-normal ?)



- pair didn't save correctly ?







pairF-phase: F shot up from 2 to 112
	{A: "BR8HH2R7", B: "LFV2FYZQ"}
===================> generated F was only looking at 'best' points and that was excluding a lot of points ?





INIT-F: 5 - 10

PEAK PROBE F: 10 - 30

FINAL PROBE F: 5 - 10 

FINAL F: 3 - 8
FINAL R: 2 - 5

FINAL TRACK F: ?
FINAL TRACK R: 0.5, 1.0, 1.5



CHI-SQUARED instead of SAD  IN PLACES ?


- could reassess local affine transform for matches based on neighborhood points

F
	setMatchAffineFromNeighborhood

R
setMatchAffineFromPatch




- better way to relate images than histogram?
	- more samples ?
	- finer histogram?

	- sub-histograms ?

	- different histogram comparrison?
		- compare all 'neighbor' bins too ?

=> pre-spread bin histogram:
	Code.histogramND = function(buckets,loopings, datas, magnitudes, joinDelimeter, round){


- more points 2D -- relax corner requirement ?

- regularization in probe2D (or additional step)


VIEW OPTIMIZING:


solveOptimizeSingleView

- should points also move during optimization => yes ?


CHECK:

initAffineFromP3DPatches

resolveIntersectionLayered





- combining & optimizing tracks:
	- SPARSE:
		goal:
			move points and views around to find best:
				VIEW locations
				(dont care about patches)
	- DENSE:
		goal:
			move points and views around to find best
				VIEW LOCATIONS
				POINT LOCATIONS


NEED PATCHES AT SOME POINT

- GROUPS:
	- how can patches be reconstituted ?


- FROM 'SCRATCH'
	- normal cam be thought up
	- size needs to be re-figured out

	=> local neighborhood averaging to get affine
	=> back project affine to get normal


- pair sparse: use patches to optimize
- pair dense: use patches to optimize

- sparse tracks: don't care about patch
- dense tracks: don't care about patch

- group/world: initialize patches once absolute is known, using local affine 2Ds 















C) filter starting F points in 2D to maximize spread -> back to around 1/40th of image



- can probe2D be helped by R / patches ?
	- affine matrixes would be similar

- once a point has a normal, is there any way to help it get better? / refresh it ?
		=> instead of using AFFINE, use neighborhood of points ? 
		=> need to drop outliers ?

- 









- direct camera position based on midpoint directions from ray
	- list of origins (closest ray) & directions (to rotate toward)
		-> how to turn this into a torque / moment ?





- TRY: approximate affine from point neighborhood
- TRY: interpolate patch from neighbors

resolution determination:
  0-1k: low
 1k-10k: med
10k-50k: hig
50k+: sup



=> at some point will need to have 'hole filling' (interpolation inside gaps, followig some gradient / 3D surface)
...



- remove references to view.image() -> view.imageScales();

var newMatch = world.bestNeedleHaystackMatchFromLocation(centerA,centerB, newPointA, affine, viewA,viewB);







- try to use local neighborhood of point distribution to optimize affine estimate?
	- initial points are optimized only with rotation and scale
	- when making new point:
		=> get point matches in area
		=> pick best? (9 -> 3)
		=> create affine matrix from 3+ points
			OR from average of affine matrixes ?
		====> need some visual validation?


=> low density / coarse grid:
	- use visual refinement to get local affine transform
	- use some blurring to allow more fluid / movable optimization / prevent local minima
		- low res comparitors

=> hi density / fine grid:
	- use local neighborhood to get affine transform
		A) point matches => affine
		B) average affine matrixes




- make sure size s = radius r for patches = 1/2 of cell size projection




pair-coarse can use image init & image refined patches 
pair-dense can use neighbor init & image refined patches
group-coarse - geometric ???
group-dense - only pre-existing c,n
world-dense - only pre-existing c,n



- pairwise sparse R doesn't need to be point exhaustive -- only need good Rs
- pairwise dense & group dense SHOULD be more point exhaustive -- need good points




- expand tracks by: (3+ views)
	- look at all neighbors in 2D view
	- if any neighbor P3D missing another view that selected point has
	- estimate predicted location by 
		- 2D visual same-point search estimation
	"hey you're missing a view, try this point @ my affine relationship ?"






a total neighbor:
	- 2D: cell neighbors
	- 3D: tangent plane + distance


-) => initial F should have ok initial affine starting point
	- local neighborhood point distribution to get:
		- rotation
		- scale
		-> optimize:
			affine nonlinear
				A) image match scores
				B) point-geometry
	- normal estimated as average of center-to-view directions
	- size estimated as ???
	- coarse points can use images (photometric) compares to optimize patches
		- 40x60 ~ 2k points 
	- dense points can use existing neighbor normals to average initial estimation
		- 80x120 ~ 10k points
	- dense points (2):
		- ~ 50k points
	- group dense points:
		- 5-10 * 50k = 200k-500k
	- world dense points:
		- millions















TIMINGS EXTIMATIONS:

- uploading images:
	- 15 s / image

- finding camera:
	15 s / image

- view features
	- 15 s / image

- pair best esimation
	- 15 s

- pair matches/matches/tracks
	- 60 s per pair

- triples calculator
	- 10 s per triple

- calc graph
	- 1 s per view

- bundle groups
	- 60 ; % 60s per iteration x n views


cams = 10;
views = 100;
pairs = 10*views;
triples = 6*views;

time_upload_image = 15; % per cam / view
time_calc_camera = 15; % once
time_calc_features = 15; % per view
time_calc_pair_putative = 15; % once
time_calc_pairs = 60; % per pair
time_calc_triples = 10; % per triple
time_calc_graph = 5; % per view
time_calc_bundle_track_group = 60; % per view
time_calc_bundle_track_all = 30; % per view
time_calc_dense_pairs = 10; % constant
% ...
time_calc_dense_group = 60; % per view/group?
time_calc_dense_points = 60; % per view/group?
% ...
time_calc_surface_tris = 60; % per view/points?
time_calc_surface_tex = 60; % per view/tri?
time_calc_texture_out = 60; % per view/texture?


total_time = 0;

% startup time
total_time = total_time + views * time_upload_image; % upload image
total_time = total_time + cams * time_upload_image + time_calc_camera; % camera upload/calc
total_time = total_time + views * time_calc_features; % features image
total_time = total_time + time_calc_pair_putative; % pairs calc
total_time / 60 / 60

% sparse time
total_time = total_time + pairs * time_calc_pairs; % pairs sparse
total_time = total_time + triples * time_calc_triples; % triples sparse
total_time = total_time + views * time_calc_graph; % view graph init sparse
total_time = total_time + views * time_calc_bundle_track_group; % view group BA
total_time = total_time + views * time_calc_bundle_track_all; % view full BA
total_time = total_time + time_calc_dense_pairs; % putatives for dense
% to sparse time:
total_time / 60 / 60
% 2-3 hours

% dense time:
total_time = total_time + pairs * time_calc_pairs; % pairs dense
total_time = total_time + triples * time_calc_triples; % triples dense
total_time = total_time + views * time_calc_graph; % view graph init dense
total_time = total_time + views * time_calc_bundle_track_group; % view group BA
total_time = total_time + views * time_calc_bundle_track_all; % view full BA

% to dense time:
total_time / 60 / 60
% 4-5 hours

% surface time:
total_time = total_time + views * time_calc_dense_group; % dense group BA
total_time = total_time + views * time_calc_dense_points; % dense point combine
total_time = total_time + views * time_calc_surface_tris; % triangles
total_time = total_time + views * time_calc_surface_tex; % textures calc
total_time = total_time + views * time_calc_texture_out; % textures combine

% to surface time:
total_time / 60 / 60
% 5-6 hours


% 10 images = 6 hours
% 20 images = 11 hours = half day
% 50 images = 26 hours = 1 day
% 100 images = 52 hours = 3 days


% TOP OF THE LINE:
10 images => < 10 mins
100 images => 1 hour
500 images => 5 hours
1000 images => 10 hours

% SHORT TERM GOAL:
10 images => 1 hour
100 images => 10 hours
1000 images => 2 days







- how to do affine optimization (image OR geometry) without 


https://www.di.ens.fr/willow/pdfscurrent/pami09a.pdf
http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.75.5394&rep=rep1&type=pdf
- limit cell point expansion by looking at 3D discontinuities in views


1)
- patch occulding filter: (outlier is in front)
	get list of occluded patches
	effectively: compare the NCC average of the occluded vs occluding & drop if worse
2)
- patch occluded filter: (outlier is in behind)
	get list of occluding patches
	effectively: Should-Be-Visible count is high and Truely-Visible count is lower than threshold (gamma=3?)

3)
- patch neighbor filter
	- get all matches in neighbor cells of p in ALL images p is present
	- if % of these are n-adjacent < 0.25
		-> drop

		n-adjacent: effectively: close in 3D & normal pointing in same direction


- SIMILAR patch neighbor filter
	- get all matches in neighbor cells of p in ALL images p is present
	- if % of neighbors < 0.25 [in 3D? get same count of k neighbors?]
		-> drop

- normal->affine vs neighborhood->affine filter
	- projected normal affine matrix should be similar to local affine matrix
		- how to compare?
			- average rotation angle
			- average scale
			- ...



- 2D planar average location filter?
	- the average 3D point of the 2D neighbors should be close to the calculated 3D point
		- unless theres an outlier ?
		- unless the 2D points are side-heavy ?


- kNN neighborhood vs cellSize neighborhood



SPARSE:
	views & points change (maybe a lot initially)
DENSE:
	views & points change (mostly little, or a little at a time)
GROUP:
	views don't change | points change a little
WORLD:
	view & points don't change

NEEDED PATCH METHODS:
	initializePatchPhotometric

	intializePatchNeighbors

	updatePatchPhotometric


	updatePatchFromViewChange -- previous & new view absolute locations

	updatePatchFromCellSizeChnage -- cell sizes have been reduced by some %


PATCH MODEL:
	- initial 3D location from triangulation
	- updated 3D location from optimizing iteration (limits?)
	- initial 3D normal from relative view locations
	- updated 3D normal from optimizing iteration (limits?)
	- initial 3D patch size from relative view location & cell sizes
	- updated 3D patch size from optimizing iteration (limits?)
	- 3D 'up'

	- s = size to project to MIN cell size or AVG cell size


LIST OF SURFACE CONSTRAINTS FOR POINTS:
	- neighborhoods
		- local 2D points should also be present in 3D space
		- (same in reverse)
		- local 3D normals should be similar direction
		- 

	- view visibility (3+ views)
		- expected visibility
			- is there a match in a view that patch_i should be visible in?
				- not too far away in distance
				- orientated toward point
				- normals oriented
		- neighbor visibility
			- neighbors will have similar lists of views it is visible from
		- 

	- occlusion
		- neighbors will likely overlap (occlude) because they are close
		- with multiple views, outliers likely be in front / behind many other patches, while the inliers will only be obstructing outliers
			- unique other patches vs sum from each view vs (average per view)
		-- with a lot of outliers, only very worst are apparent
			- could consider which patches outlier is occulding: if they're more likely inliers -> more sure, if more likely outliers -> less sure
				- ratios of:
					- FRONT_ME / SUM(BEHIND_OTHER_i) [am i in front of a lot of inliers ?]
					- BEHIND_ME / SUM(FRONT_OTHER_i) [am i beind a lot of outliers ?]
					=> div by 0 : set den min to 1
	
	- connectivity/regularity
		- neighbors are locally planar & should have consistent orientation (no crossings)
			- crossing?
			- metric?
			- predicted location 2D
				- every point uses affine (from local point approx or projected patch) to predict where neighbors should be in opposite images
				- outliers will have larger values than 
					- use ratio for outlier/inlier ?
			- 3D ?
				- backproject 2D neighbors onto 3D point plane
					- predicted location vs actual 3D

	- planarness
		- neighbors should be in roughly same place (distance from surface minimal wrt neighbor distance)
			- point has local plane in 3D
			- neighbors are some distance away from plane (along normal direction)


..........................

how does neighborhood normals behave around corners / sharp aread?
if normals are different enough, maybe shouldn't be considered neighbors


..........................





..... LOOKUP:
fibinacci sphere
cube sphere
icosohedron sphere
tetrahedron sphere - edges 



- with R/K:
	- maybe affine mapping is better done using local point inlier finding -> NOT PATCH AFFINE MATCHING ? (don't know normal)


- remove points with lots of scale differences

- regularization for final connected point set
	- allow to move slightly and increase local error if it reduces global error (somehow?)


- F-rotation & affine-rotation should be consistent
	- find worst offenders (difference in angle) & drop















NEIGHBOR DISTANCE DROPPING:
	if average difference between neighbors is high -> remove

NEIGHBOR PREDICTION ERROR DROPPING:
	- each feature gets ~ 8 neighbors
		- estimate predicted location vs actual location
		- add error to accumulator
	- each feature average accumulator error
		- ...
	- get global distribution of prediction errors
		- drop worst

accumulator: SELF
good + good => good:low
good + bad => good:med, bad:hig
bad + bad => bad:hig, bad:hig

accumulator: OPPOSITE
good + good => good:low
good + bad => good:med, bad:hig
bad + bad => bad:hig, bad:hig






errorNCC\([a-z,A-Z,0-9].*\)



‘interp2’

R3D.progressiveMatchingAllSteps

world.solvePair(internalCompleteFxn, project);




affine - use synthetic normal vector &project 


- image error

- homography

- image alignment

- 


- color profile mapping
	-> mapping colors (continuous ?)


R3D.rotationScaleCornerMatrixLinear = function(pointsA,pointsB, reuse){


resolveIntersectionDefault





R3D.affineBasicFromPoints2D = function(pointsA,pointsB, sourceA,sourceB, affine, returnInfo){




this seems bad: 
Stereopsis.setMatchInfoFromParamerers












- change alg to be F focused, not BOTH F & point focused?



- DENSE F :
	- enter views into world [should NOT need cameras]
	- set cell size
	- enter initial points
	- init points:
		- pic scale/rotation that optimizes 2D compare

	- expand neighbors
		- 2d transform?:
			- angle:
				- nearest neighbor
				- neighborhood consensus
				- relative F
			- scale:
				- nearest neighbor
				- neighborhood consensus



---- DENSE CORNER POINTS 

- some fxns only want corner points, not features fitting criteria
	var cornersB = R3D.differentialCornersForImageSingle(imageIdealB, imageCornerDensityPercent);

-  may also want to:
	- drop low contrast areas
	- drop low corner score points



R3D.findLocalSupportingCornerMatches
	- corner - local increase of matches -- 2-10x as big as initial corner search
		- different ways to get angle
		- different ways to get scale
		- ignore F ?
	=> how to be fast
















pair matching steps:
A) unknown feature matching [100px 100m]
	- some correct matches, possibly a lot of noise (1:2)
B) local corner-feature matching [20 px 200m]
	- added matches around the correct matches
	- drop some of the worst matches
	- initial, useable F
C) corner-dense matching [5px 100m]
	- increase seed-point matches around image
	- reduced F error
D) dense F point matching [1px 500m]
	- spread good seed points
	- remove poor points
	- keep only the best: F, N, S
	- reduced F error

=> good F & seed 

E) sparse-dense R point matching [1px 1000m]
	- R initial
	- spread good seed points

D) dense-dense R [<1px 10,000m]
	- new seed points => propagated points
	- updated R

G) dense-group
	...



- ignore low contrast features
	- range filter for each point - max middle pixel difference
	- drop worst ~ 10 %
	- drop constant < 0.04

- ignore low entropy features:
	- 









- drop low contrast (flat) regions : ~ 7x7 area , get range, minimum ~ 0.05
	- before feature?
	- feature?
	



STEPS:
	get image at ideal size in pixels (600x400 or smaller)
	for each image scale [1, 0.5, 0.25, 0.125?]
		- get best corners for image at size [1000, 200, 50, 10]
			- space peak first maximal suppression
	add all best corners
		- space peak first maximal suppression
	for each remaining corner [1k ~ 2k]
		- for each scale size [2.0 to 0.25, 10-15 samples] - [2.0, 1.5, 1.0, 0.75, 0.5, 0.4, 0.3, 0.25]
			- get response for image metric in ~ 5x5 window
		- if corner reaches a maximum not including ends
			- add to keep list, include scale
	
	interum: ~ 1.5k feature points

	remove most similar features [SAD / NCC]
		- for each feature
			- get a flat example image [7x7-11x11] @ point, angle, scale
		- for each feature
			- for each other feature
				- compare flat SAD area & append score to each feature's score list
		- drop most common features:
			- find where scores crossing is 50% between most similar and least similar scores
			- if percent of probable mismatches > ~ 10%
			- if first 3-5 scores approx. line is fairly shallow -> too similar
				- drop point
=> PLOT SOME OF THESE GRAPHS


	output: ~ 1k feature points













- detected features don't seem repeatable:
	- corners
		- find peaks of COM
			- corners
			- edges
			- noise
		- remove low-response corner scores
		- remove low-contrast flat-image
		- remove edges
	- blobs
	- MSER


RESPONSE PEAK IDEAS:
	- COM magnitude maximum 
	- sigmaDiff/sigmaSame maximum [most narrow corner]
	- direction gradient / (avg perpendicular gradient) minimum [gradient in all directions]








	- what fxn 'response' is used for peak scale?
		- DoG ?
		- cornerness ?
		- ...
		- plot this


...



R3D.SIFTBlobsForImage


- blobs:
	- are corner scale space extrema useful ?
	- are corner corner-space extrema useful ?



- MSER:
	- 



- F is too unreliable to produce R for repetitive scenes
	- F->R accuracy [muffin scene]
		- are the points 
	- propagating seed points:
		- get RANSAC average scale & average rotation for neighborhood
		- vote on neighbors to drop
	- dropping outliers:
		- GLOBAL:
			- F error
			- N error
			- S error
		- LOCAL:
			- scale differences
			- rotation differences
			- F error ?
		- ...



R3D.affineBasicFromPoints2D

R3D.SIFTExtract




- Feature Points - ACCURACY
	- BLOBS COMBINED WITH CORNERS




- skeleton combining & scale drift






- final group stereopsis still very blurry
	- separate reconstructions for each pair
	- noisy points








solveDenseGroup -- try seeds from tracks


- F is not reliable enough to create accurate R in situations
	=> 

- F DENSE BEFORE R DENSE ?
	- add step after seed Fs are found
		- filter on:
			- N error
			- S error
			- F error
		
		- affine from:
			local average (6 to 3+ best pionts)
		- single point:
			only get rotation
		=> this is already sone somewhere

		- propagation only based on F transform

		- don't need patches

		- pick to 50% F & 50% N & 50% corner => 12.5 seeds
	- 

SKELETAL PROCESS CHANGE:
- what to do about combining view matrixes (scale drift?)
	- track_skeleton.yaml
		-> iterate on solution
	- track_full.yaml
		-> iterate on solution
- ???





- camera calibration: allow to solve 2 cameras with s = 0 ?
- larger camera resolution for camera accuracy
- 
calculateCameraCheckerboard
loadCalibrationImage


- muffin series has a lot more similar views, maybe best pairs aren't being found ?

- lots of close view-pairs are initialized to opposite (wrong) sides
	- low R error, but messed up image
	-> try solving simultaneously with alternate solutions?
		- reprojection error ?


even when absolutely clear ...
	=> bad starting matches ?

forwardCounts
bakwardCounts

=> HOW TO INCREASE RELIABILITY OF INITIAL R:
	- better matches
		- bigger feature size region?
		- 
	- allow region expanding while initting ?
		- 
	- detect bad triangulations (points behind view ?)
		- 


	- can't drop negative points - in case is opposite...


HOW TO DECIDE?:
forwardCounts: 83,83,83,83
R3D.js:973 bakwardCounts: 0,0,0,0
R3D.js:986 (4) [Matrix, Matrix, Matrix, Matrix]
R3D.js:987 (4) [83, 83, 83, 83]
R3D.js:989 none or multiple?




OTHER UPDATES:

- track iterating => try ALL-CAMERA simultaneous optimizing

- combining tracks => can't re-estimate 3D locations / combine separate tracks




id: "FOA6MFXX-QIDRJ3GU"











// var projected2D = R3D.projectPoint3DToCamera2DForward(point3D, this.absoluteTransform(), K, distortions, false, point2D);
	var projected2D = R3D.projectPoint3DCamera2DDistortion(point3D, this.absoluteTransform(), K, distortion, point2D, false);




project._taskDoneCheckReloadURL();



last checked:

id: "F4G0C10T-YOC1JXLQ"
id: "KXI5RI6F-YOC1JXLQ" <<<





- automate process of converting all input images to rotated same orientation (landscape right-top?)



- new camera collection set of images for calibration (10+) accuracy
- go thru process with new easy set: 10-15 images
- walk thru process and fix bugs






P3D -> P -> L3D -> PROJ -> p2d -> D -> d2d -> K -> i2d

K(fx,fy,s,cx,cy) & radial(p0,p1,p2) & tang(k0,k1) & EXTRINSICS (6) ???


BundleAdjustCameraParameters


applyCameraDistortion


R3D.linearCameraDistortion



R3D.BundleAdjustCameraParameters(



R3D.applyCameraDistortion


var listM = R3D.extrinsicCalibratedMatrixFromGroups(pointGroups2D, pointGroups3D, listH, K, Kinv);
listM = R3D.extrinsicNonLinearFromGroups(pointGroups2D, pointGroups3D, listM, K, Kinv);




- triangulation:
	- some triangles are black?
		- pulling texture from points outside image?
		- pulling texture form 
	- edges are choppy

	- missing triangles in random places


- camera calibration - CHECK TO SEE IF UNDISTORTED IMAGES IS MUCH DIFFERENT (to help accuracy?)

	- test synthetic scenarios
		...
	- image rectify
		...
	- 


- SURFACING:
	- keep triangles on 'top' of surface (points), not in the 'middle' of point plane






- try dense group with entire view graph together to know what the best COULD be -- single group
	- use seed points as passed original track points (not found new seeds)
	- 
	- towards end: drop everything with error > 1-2 pixel ?







- triangulation should be ok with some 'holes' -- large disparity -- in size

- triangulating recognizing empty perimeter => fill in hole with triangles

- 


initializeBundleGroupsFromDense



iterateBundleProcess









- dense points are still fairly fuzzy
	- higher resolution images?
	- prevent groups from optimizing view locations?

	- do point 2d intersections on group combines ? [1/4-1/10 cell size ?]


- dense points are not getting combined correctly
	- TRY:
		- use original view locations
		A)
			- same dense point2Ds
		B) 
			- separate dense groups not optimize orientation

- find initial starting locations using nonlinear skeleton-static? angle-error
Code.graphAbsoluteUpdateFromRelativeTransforms = function(initialP, edges, maxIterations){

- limit full group track combine to only ones for view's top 3 pairs 
full_pairs: ~ views x 3 ~ 33, not 11 x (10) / 2 ~ 50



- solveOptimizeSingleView

- optimize all at once?
	solveDenseGroup








- how to handle points very far away => infinity
	- need to recognize when they exists
	- project to sphere surface ?









- optimizing skeleton only, then other views should be updated nonlinear
	- keeping skeletons constant ? ()
	- variable non-skeletons
	- use relative transforms angle-error (scale may have drifted)




triangulatePointDLTList

var result = Code.graphAbsoluteUpdateFromRelativeTransforms(initialP, solveEdges);





			
			// groups,views,pointsFileName


			// throw "update points"

			// load next group file
			// "points.yaml"

			// C) update points
				// iterate thru each group's dense file
				// update point's triangulation using optimized view orientations
				// put points into OctTree
				// merge with existing points when points are too close (global size or local size from group)
				// AVG POINT, AVG NORMAL, UNION VIEWS
				// possibly clean up points?
				// save final set of points to bundle/points.yaml
				//







- aggregate groups
	- need updated location estimates (from drift)

- update P3D & drop worst & save to file
	- limit = 2 sigma of original view R error





- how are matches/tracks/points calculating intersections / good / bad?
	=> visual patches ?


- need period of not expanding, but just removing bad matches



track expansion NN not gaining as many large tracks (3+)
	- loosing points based on new bad matches ?
background / far points have lots of error
	=> ?
average reprojection error SIGMA still ~ 2 px => should be < 1
	=> ?









AGGREGATING VIEW GROUPS:
	- scales of groups could have drifted
		- find each group's overlapping pairs [not necessarily listed edges]
			for each group
				for each view 
					for each other view 
						add/update entry viewI-viewJ = [groups: 0,1,5,...]
		- solve for relative scales for all overlapping view pairs
		- set minimal pair scale to 1, and update all other groups to be in same absolute scale
		- convert ALL edges to relative transforms (in absolute scale)
		- initialize global orientations from initial bundle locations
		- minimize expected vs actual pair difference
		=> final absolute view locations
	- points need to be recalculated
		- for each group
			- for each point
				- DLT find point from N views
				- calculate R error
				- drop points whos error > 2 sigma of view (from original group calculation)
				- P3D normal = average direction to views
		=> save points to single file







- how well is the point 3D projection helping with point placement ?
	- this hasn't been A/B tested / calibrated


















- logic for updating patches only -- not recalculating sizes & whatnot
	- assume little change in position / orientation when group solving



15k - 40k in each dense pair file
pairs ~ 8(8-1)/2 * 0.5 = 14
14 x 40 = 500k










- logic to end solvePair if R / count / error not changing






BUNDLING PROCESS SOURCE:
	- tracks from dense iterations
		- have to re-calculate dense aspects
	- dense relative data calculated previously
		- will have more bad patches

	- updating optimal view locations AND point locations?
		- re-calculate view absolute transforms from pairs
		- need to re-calculate points & normals
			-> redo it in each group
			-> do it with or without images




design backend system to keep track of everything
- storage
- tasks ?
	- possibility of non-completing / error ?




bundle/bundle.yaml
	views
		-> absolute positions & info 
	cameras
		-> lookup for all views
	groups
		- 
			file: group_i.yaml
			pointCount: N
			viewCount: N
			transforms:
				- all transforms between group views passing some minimum (point count & error?)
	ba:
		points: points.yaml
		aggregateIndex: -1 # update each group's views/points & save to file
			

bundle/groups/group_i.yaml
	views
		-> subset only needed for this group
	points
		- 
	cameras
		- 
	transforms
		-> after first iteration



BUNDLE PROCESS:
	save initial groups as tracks
	for each group -> solveGroup [while group_i transforms is null]
		- remove bad pts: behind, obscured, 
		- increase point counts to dense
		- update camera positions


	A) 
	update absolute view location
		- use separate group data to nonlinear update initial absolute graph
		-> scales may have drifted
			- use overlapping transforms to re-scale pairs
	for each group: update point estimates
		- update group_i's view absolute locations
		- update point location & normal & size

	B) 
	each group has a set of best tracks
	load group-tracks into single file to update absolute locations








TEXTURING UPDATE:
- increase texturizing accuracy
	- instead of using projected points as source of truth:
	- use projected point as approximate location
	- search neighborhood (pixels) for more precise projection location
	=> requires loading multiple images at a time to have needle/haystack finding
		- first & second images loaded
		- first is taken as source of truth
		- secondary are used as discovered locations
		- estimated point => found point
		=> further estimated points must first load a view with a found point 
	=> primary view may need to be view with:
		- most normal/close ranking
		- highest number of triangle references
...


- review why tesselation is failing
- failing thoughts:
	- get sphere around kNN count? [is there much of a difference]
	- notmal = direction AWAY from point COM
	- cov calculated correctly (normal?)
	- display / visualize when curvature is high & why
	- display some groups

- try lower degree polynomial (2,2)?


- does moving along normal actually bring noisy points into line ?

- push out along parallel plane (remove concensed points)?


- is curvature high because? :
	- points are very close together ?
	- surface normal is not 




- test curvature on highly accurate surface with high curvature
	- wavy toroid





- numbers of points needed in samples is very high, eg 100-300
=> a perfect surface would have like 10
=> a noisy surface would have like 20

=> want below 50 


https://h2t.anthropomatik.kit.edu/pdf/Roehl2011.pdf
https://pdfs.semanticscholar.org/31b7/08290e42f8a6a9333fa59755222da786733a.pdf
https://people.csail.mit.edu/changil/assets/point-cloud-noise-removal-3dv-2016-wolff-et-al.pdf
https://www.uni-konstanz.de/mmsp/pubsys/publishedFiles/DaHaOc07.pdf

http://www.sci.utah.edu/~shachar/Publications/FleishmanThes.pdf






-> point smoothing ?
	A) each point:
		- get 3-6 NN
		- get centroid
		- move toward centroid



- drop halo points too far away
	- get samples of local density (3-6 NN distance average)
	- remove points that are way outside of these numbers
- stop triangle propagation to small groups of triangles








- filter: single-view's z-distance [LOG(D)] removing too far or too close
- filter: globally removing points outside ~ 5 sigma distance from centroid

propagate 3d: -- non-blind probe3D
	each P3D look at kNN
		if theres any view neighbor doesn't have
			=> estimate projection & affine , and search




- after the minimization of errors on the tracks, could remove a lot of the BAD track points
	- negative
	- high error
	=> more iterations



- if views are adjusted in GROUPS of stereopsis (mildly) to optimize the dense process
	=> how could the groups be combined later to be a single ?
	
- yet another bundle adjust now with tracks from dense groups
- start with dense world graph
- nonlinear minimize error using relative edges from dense groups





=> speed up world view/transform lookups
	- world stores a list of transforms for each view
		=> lazy init



=> do match scores need to be re-assessed when R is updated? previously good/bad matches might be different after a while












- probe2DCells - want to update patches using new global version


2D neighborhood R / F / N error
	- filtering how would this look?
		- large survey and remove small pockets of outliers?






- stereopsis still needs to be better at discarding outliers (groups of points outside error)




- top of bench is frequently wrong & assigned as part of tree BG




R3D.relativeTransformMatrix2
=>
Matrix.relativeWorld


filterPairwiseSphere3D
=>
filterGlobalPatchSphere3D




stereopsis - estimate3DViews -- ????????????????? what does this do?







-------------------------> ALL Rs are too bad to have useful F-matches
- are relative transforms from absolute correct?


	- how does a scale in R change the F / search ?

=> TRACK OPTIMIZING IS NOT MAKING BETTER











AT SOME POINT:
- remove outlier rotations / translations
	- Bayesian interference
	- the graph is checked & cleaned
- global rotations are computed using a sparse eigenvalue solver




- each vertex knows where every other vertex is WITH SOME ERROR VALUE, further away vertexes (edge distance) are typically higher in error




STEREOPSIS ABSOLUTE TRANSFORMS FROM RELATIVE
	=> SHOULD THIS INCLUDE ANY RELATIVE ESTIMATIONS / OR BE EXACT?


need to combine initialization / iteration processes for averaging / optimizing:-------------------------------------





- RECHECK:
- add step to assess which pairs should be discarded, after all pairs are complete, before triples are done:
	- ignore R > ~ 10
	- ignore score > ???
	- ignore: F / NCC / ... ?
	- for each view:
		- sort pairs on METRIC
		- limit to top ~ 10
		- limit on sigma = 1-2 [68-95%]
	- need to MARK the pairs as included / excluded in further steps

- what does dense R-searching step use as the matching feature locations?
	=> choose points to use for R
		-> harris corners?
		-> differential corners?
		=> display the different selections
		- with R to narrow options, can stand 1-2k points





- notes:
	- way to help discard poor points?:
		- difference in total energy change drop : log : high & low ratio
	- try also using blobs/SIFT as additional feature type
		- add parameter to feature type





- R sigma error is bad metric for comparing the accuracy of a pairwise R-image
	=> need some other metric to define HOW GOOD a pair match is
	[and therefore: when a transform needs to be re-initialized & which pairs should be ignored]
	R-F ratio ?
	- occluded
	- ability to reconstruct each image & to what percent complete?
		=> % of cells with match
	- segmentation / groupings [how continuous?]
	- local 2D neighborhood metrics?
	- use camera baseline as reference size?
	- use world point extent as reference size?
	=> (average 2D knn 3D distance)/(average scene volume - covariance matrix) ---- smaller is better



resolveIntersectionPatchGeometry
resolveIntersectionPatchGeometryImplementation


- patch obstruction using all 3D points from single view [not pairs]
	- removing points based on score in local group
	- removing points based on score globally


- allow corners / features with large scale difference to still be located nearby in 2D
	=> 3D location = x,y, ~ 2 x lg(scale)
		8.0 => 4
		0.25 => -4



DENSE MATCHING R-STEP:
- do efficient pairwise object extraction
	- 2 purpose procedures
		- F: to use general area
		- R: to have specific distinctions


- plot propagation groups / dense point results in 2D ?
	- see how poor-isolated-groups look like


- HOW TO REMOVE POOR GROUPS
	- on add:
		- if a neighbor can find a 'better' spot -> remove old one
	- on group-collision
		- compare 'best' of each group:
			- NCC & R & F scores

- what matters is the perimeter -- 
	- a group may be correct in 1 area but not in another -- so removing the ENTIRE thing must be thoughful if at all
	- 

	geometric inconsistency:
		- get all neighbors in 1-1.5 cell distance
		- predicted neighbor position & actual neighbor position  >  1-2 x cell size
		=> if R (| &) N score is better/worse:
			- remove others/self

	>>>>>>>>>>>>>>>>>>>>>>>>>>
	ON-ABOUT-TO-ADD-MATCH
		- check neighborhood in viewA and in viewB (for matches that only have views A&B)
			- search radius ~ 1 cell size
			- for each neighbor:
				- if predicted geometic location vs actual location in opposite view is > ~ 1 cell size
					- add inconsistent match to list
			- for all inconsistent neighbors:
				- find closest one ?
				- average R / N errors
			- if representative / averaged R & N errors are:
				- better than this:
					=> don't add THIS match
				- worse than this:
					=> remove all inconsistent neighbors
					=> add THIS match
	<<<<<<<<<<<<<<<<<<<<<<<<<<

probe2DCells


...


- how will removal of obstructing patches with all views loaded at same time?
	- transform - pairwise
	- single view loads any 3D point it sees into a single scene
		=> better propagates errors across scenes
	- what about 'SHOULD SEE' points ?




- unoriented gradient histogram by aligning peaks together [or doing 8 x N compares and using best]





thinking experiment A:
	- label every seed with a #
	- seeds propagated take on the # they inherited
		- what about collisions?
			- take on 'group' # with better NCC score
	- at sites of collision, group A can evaluate group B
		- if predicted points coinside => merge group numbers
		- else
			- A) remove all of opposite group
			- B) replace conflicted location with group with better avg ncc scores
				- increment opposite group's loss count
				- remove group if it has acquired a large amount of losses

........




- rerror & ferror don't track with poor edges, need better way to remove bad points
	=> READ ABOUT HOW TO GROUP DROP?
		- fix incorrectly made points
	=> how to correct bad patches / globs on global view ?

	A) remove patches that are not visible in at least 3 images
	B) expand -> filter -> repeat
	C) depth map for pixels to remove spurious
	D) 'new/putative' patches are discarded if no existing neighbor patches project to the same cells in the opposite image
	E) 'should be visible' constraint ?
	F) 'close' but not neighbors () ?
	G) group discontinuities with neighbors () ?
	-) single cell size @ 1x1 | 2x2 (no progression)
	-) single-camera-depth neighbor filtering: for a single view/image: patches are marked as consistent based on distance from single view []
	p48)
		1) neighbor-occluding response ? => NCC outliers
		2) any occluded by neighbor patches
		3) neighbor-consistency & depth consistency (& not enough neighbors?)
		4) small-sized groups (size 6 or fewer) are removed ... not helpful
=> useful to mark patched as ESTABLISHED / vs / PUTATIVE when filtering, so that new erronious points don't overwhelm/skew the filter


Poisson Surface Reconstruction algorithm by Kazhdan et al. [30] i



FILTER - ALGS:
	- SINGLE: no common 2d neighbors (or low percent, <20% : 0.7 lowered to 0.2)
	- GROUP: ?
		- rerror, ferror, nerror are all consistent
		- neighbors are (falsely) consistent


=> IDENTIFY BORDERS:
	- for every point, where there is a large inconsistency between:
		- depth ?
		- expected opposite-point location ?

=> HOW TO IDENTIFY GROUPS?
	- all neighbors have similar distances to (each respective) view image
		- put all points into queue
		- pop of top while queue is not empty:
			- if p already processed, continue
			mark p as processed
			- if p has no group assignment, assign it one
			- get average 3D distance to neighbor / depth to view
			- for each neighbor q of p: [if q close enough to p / view]
				if q doesn't have a group:
					assign q to group p
					put q at top of queue

	... any occlusion between a single patch corresponds to an occlusion between groups

	... choose which group is better based on?: 
		- avg rerror
		- avg ferror
		- avg nerror
		- avg surface error (average list of sigmas)?

	... try to trim away at borders ?
		- meeting group edges will have inconsistent neighbors in at least 1 image



... keeping track of surface 'connectivity'
	-> at borders: resolve whether there is a depth discontinuity else a join of surfaces should be consuming the other
		-> how to decide which group is more right?
			- some metric?
			- local average sad / ncc ?
			- 
	-> how to account for sub-dividing?




- ...

- on 2D probing: - local pruning
	- if 'neighbor' error is much higher than self/others
		=> remove neighbor



- combine DoG and corner feature matching [& others?]
- make sure features are pre-smoothed to remove noise
- should be getting 1000s of feature pairs, not 100s


- why is R-ERROR equivalent to the 'middle' plane? => dropping based on R-ERROR & F-ERROR is not useful
	=> other metrics (filters) need to be used to get rid of the higher-frequency points?
- 








..........................




- affine is inaccurate -- rotation ?
	- R3D.patchAffine2DFromPatch3D

- why so few matches (~100)?
	- top choice might be very close to second choice?
	-...
-


- make visualizers for:
	- grayscale-sift
	- color-gradient-rift [self - avg]
	- color-sift [dCx + dCy]





TEST:
var info = R3D.cornersFromColorGradient(imageMatrixScaled);






is color gradient some sort of surface normal? --- ie orthogonal to 'surface ?'

MOST FORGIVING / LESS ACCURATE => TO => MOST SELECTIVE / MOST PRECICE 


2 kinds of best:
	1:1 & sort & keep top / scale scores by some percent [eg linear falloff]
	1:9 & keep top

- plot some of the score distributions

--- what does it mean to have an outlier with various 'error' distributions ?
	- what does sigma look like:
	eg:
		- only a few are similar, others are very diff
			| ...  . ..  .  . .  . .............
		- many are similar, few are diff
			| ... ...... .. .      . .    .. . .   .
		- even spread
			| .... ...... .. . ..... . .
		- 
blurred + best 50%


SIFT-SINGLE-GRAYSCALE
	- get 7x7
	- blur to 5x5
	- gradientX
	- gradientY
	- inner 3x3 bin gradients into 8 [percentage-wise]
SIFT-SINGLE-COLOR-FLAT
	- ...
	- 
SIFT-SINGLE-COLOR-GRAD
	- ..

SIFT-HISTOGRAM-GRAY/COLOR-/FLAT/GRAD


- any comparison has to assume there's some misalignment & some error in objects in image
	=> pixel perfect comparisons can penalize too much in cases



FILTERS:
	- goal is to remove the more likely outliers at each step before more-time-consuming comparators are made
	0.90 ^ 5 = 0.6
	0.75 ^ 5 = 0.25
	0.50 ^ 5 = 0.03

- overlapping 'histograms'
- 


avg color 							AS-IS  --------- only good for very different matches -- maybe this is better calculated using blur + center pixel ?
color histogram 					AS-IS  --------- OK
	- best-50% histogram 			AS-IS  --------- doesn't work well for unknown histogram length --- & most are 
low res [filtered] icon SAD 		ORIENTED 	[@ x2 zoomed out?] 5x5 -> avg -> 3x3
	- best 50% SAD 					ORIENTED
low res gradient histogram 			ORIENTED 	grayscale 8-bin magnitude ...............
lowest-error SAD 					ORIENTED
best needle-haystack SAD 			ORIENTED 	[use inner block to avoid re-getting]

11x11 -> 9x9 -> 7x7 -> 5x5 -> 3x3


sortCompareProgressiveColorHistogramBest


... pre-calc each object
x average color 
	- drop 2+ sigma outliers ???? 
v histogram
	- top 50%
... calculate affine
v affine scores
	- top 50%
... extract 5x5 interrior + avg filter to 3x3=9 + grayscale gradient histogram
blurred 3x3 match
	- top 50%
gradient histogram
	- top 50%
best-SAD 50% scores [5x5/2=25/2=12 ]
	- top 50%
... extract 11x11
best needle-haystack 5x5 center inside of 11x11 opposite
	- top 50%
COLOR GRADIENT HISTOGRAM THING
	- top 1&2


=>>>>>>>>>>>>>>>>>>>>>>>>>> CONCLUSIONS:
only have limited filtering that can be done before each patch is made:


2000 * 0.05 * 0.50 * .50 * .50 * .50 = 6
2000 * 0.10 * 0.90 * .90 * .50 * .50 = 40

* F-line distance search [5%-10%]									(90-95)			v
...
* blur-color histogram SAD [50%-90%]								(50-90)			v
* affine drop worst [50%-90%] 										(25-81)			v
=> extract 11x11
=> filter blur to 9x9
* blur single histogram [50%]?										(.....)			?
* SAD closest blur 9x9 [50%] 										(13-40)			v
=> filter to 7x7
* oriented 3x3 histogram (11x11) [50%] ?							(7-20)			?
=> cut 5x5
* SAD best needle-haystack 5x5 (or 7x7) in 11x11 [top 2] 			(2)				x?
	- top 2 should be distinct points -- its possible the haystacks have overlap
... CHOOSE

- TRY MULTIPLYING EACH CACHED score to get final score to choose from?







- ISOLATION FOREST




	- 













- find the least-error affine projection
	- minimization along F-line?
- extract an area around the best projection (along F-line) (haystack = 4 x needle +  2 x needle)
- search needle in haystack along line

algorithm assuming most perpendicular normal point (or lowest affine error metric) along F-line is optimum location:
	- for each corner in image A:
		- get F-line in image B
		- get normal projection length at each end
		- subdivide line to find minimum normal projection length location on line
		- get affine transform at optimal location
		- use relative overall scale of optimum affine transform to determine extracted haystack scale|height
			- haystack oriented along F-line
			- haystack height = needle height x 2
			- haystack with = needle height x 2
			- needle height = cell-feature-size
		- needle-haystack search optimal SAD location
		- keep best location if error < max R error
	- drop worst SAD score points

...




- more educated patch outlier dropping: group patch together dropping 
	- local connectivity connection based on depth 
		- boundary segmentation
	- visibility constraints
	- image segmentation:
		- RGB values
		- histogram
	- neighbor consistency
	- 

..... ways to find outliers:
	SINGLES:

		- difference in normals?
	GROUPS:
		- need way to SEGMENT groups:
			- average distance from each visible camera = patch depth
				- average neighbors to get sigma
				- each neighbor within 2 sigma is considered same group
			- ...


- segments BG:
	https://researchspace.ukzn.ac.za/bitstream/handle/10413/14540/Khuboni_Ray_2015.pdf?sequence=1&isAllowed=y
...


~ reduce haystack search area



- 








- initial points seem just bad ?

	searchMatchPoints3D

	- do search in 'best' candidate area?
		- better pixel localization
	- drop worst matches by scores after
		- which score(s)?
- least distorted affine might be best?
	- keep only affines in lowest error ?


	- filter by:
		A) more correct SAD on larger scale (zoomed out)
		B) more correct SAD on a smaller scale (zoomed in)




- search 2D again
	- get best point adjacent to cell that satisfies:
		- N & R & F errors all below EXISTING ERROR SIGMA (2.0)
	- use original affine only (no need to nonlinear adjust find 'best affine')
		- predicted point @ = B + affine(old->new)
	- search for needle inside 2x window [11 & 21]
		- extract rects using imagescales
		- ncc / sad
	- choose best point
	- create new match if statisfies:
		- N & R & F errors all below EXISTING ERROR SIGMA (2.0)
	- ...

- is projection of patch to affine good?
	- plane vs sphere

- maybe just use SAD/NCC on R-F-line search


--- NCC location of peak seems like it could be off 
... perhaps try to average scores in ~ 3x3 window to pick best -- average the change in position?

- add fwd bak check
- add sad & ncc agreement

DIFFERENCES? : 
world.probe2DNNAffine(2.0); // 1-2
	- bad
world.probe2DCells(2.0); // 1-2
	- such low error?




- add more filtering on initial search:
	- add more corner points total
		- limit used points to only closest 20-50
	- filter out worst RIFT / NCC / F / R scores



....

- account for more and less degraded situations:
	- if poor/few matches found
		- try just using rot/sca affine matching?
		- increase allowed pixel error range




x yaml error on reading after empty object / array
	=> should detect indent is less or equal to current & end the array


- propagation seems to halt, even with <1px error
	- 'allowed' areas of propagation is limiter [only those with low BLA error]

	=> RECHECK PROBING CODE .... ?

	- might be able to use affine from predicted  3D point rather than from propagated source ...
		- or is this how its done already from the patches?

- back to blotches of correct / incorrect patches
	- 

--- how can the blotches be removed across all views in 3D world together ?




- DISCOVERY NOTES:
	- are the corner images using imagescales to do image comparing/extracting?
		- 
	- what are the sizes of the patches used? [expect zoomed in to be OK]
		- compareSizeA: 25
		- needleSize = 11;
	- what do some of the example success/failure 2D propagated patches look like?
		- 





[PP-4584] Update Addressables platform directories & add async file-exists code path for android specifically [???]



----- NEED TO ADD IMAGE-SCALES FOR ZOOMINGS ???

- allow searching in un-mapped areas
	- [not using seeds]
	- if error is low enough,
		- pick center of cell from A
		- use the R/F to:
			- limit search along line
			- how to get discrete search set? ????

			- still needs to be salient feature ....
				- any way to do a search strip?



-- projection of SPHERE vs projection of CIRCLE-PLANE

				probe2DNNAffine


....



NOTES ON STEREOPSIS / ...


stereopsis patch view graph filetype:pdf




































- limit a lot of processing by removing worst of affine transforms
	- very thin [large scale]
	- very skewed [small angle]
	=> 


- how bad is it if incorrect views/pairs are kept in ba process?
	- could prevent other views from getting better approx
	- 

- assuming incorrect matches / placements made it thru the initial filters, what are full-BA ways to detect a bad view?
	- if view has a transform with lot of its points 'behind' it
		-> that transform is likely bad
	- if a view has a lot of error compared to neighbor views
		-> view is likely bad
	- ...



- try different set with likely better pairs ...



- sparse process: graph.yaml view orientations seems much better than track_full.yaml orientations
	- which views are bad?
	- which pairs/groups are bad? [how to know = display group tracks?]
	- is it the offset / combine process?
	- is the bad view just very wrong?
		- how to detect? [maybe at least flag it if the error is way different?]

	-- DISPLAY WORLD GRAPH FROM ABOVE???

-> see if full bundle process re-fixes things?

....








- BA on tracks_full.yaml
	- ""

- get dense putative estimates
	- load final sparse file, create graph from the views & edges from pair count [don't need stereopsis]
	- direct & 0-1-2-3 best next neighbors
		views:
			- 
				id: A
				R: [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6]
			...
		pairs:
			- 
				A:A
				B:B
				R: [1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6]
			...
	- save to dense.yaml


- thinking in terms of CELL SIZE and not IMAGE SIZE / resolution ...
	- cell size is effectively highest resolution [+cell dimension]
	- when comparing errors / numbers between different images, they should be converted to cell-distances, not pixel-distances

=> convert reprojection error to terms of CELL SIZE, not pixel size






- affine from patch is only scale / angle ... need skew & such too ... linear soln may be too slow tho?










patches can be highly different between disparate view pairs
	- technically the same point on surface, but the 2D visuals will drop it
	- flat surface maybe ok, but edges and corners could be poor?


benefits of using images to resolve tracks:
	- more obvious identification of bad matches [only for loaded images -- which is always the case with pairs]
		- due to:
			- bad affine
			- incorrect match

benefits of using only geometry to resolve tracks:
	- not consider edge cases
	- faster processing w/o ncc/sad calcuations
	- even bad patches will likely already have good 2D matches & images will not be useful

	=> how to add 3D point checking / validation step?



TRACK LOADING:
keep track of pairs next-to-load [per group or full]

track file contains 'final' state of all points

if there is a pending list:
- there is an accompaning list of 'missed' views that should be loaded
- order views by most 'missed' tracks & load those in priority (along with pair)

no pending list = load next track pair
- anticipate the most likely views needed to load for the case of an intersection on pair 'I-J'
	- pairs of I most common [highest count]
	- pairs of J most common [highest count]
- if at least one other image is loaded in the compare, the resolution can complete
- if not, the point is un-merged, and the list of unloaded views should be noted, and added to some list for the next load

? record all combinations of track-point view-list

graph.yaml:
	loadGroupIndex: -1 # currently loading track group
	loadPairIndex: -1 # currently loading pair

	...
	groups:
		- 
			filename: tracks/tracks_INDEX.yaml
	...


tracks_id.yaml:
	views:
		...
	pairs: # need?
		...
	points: # done point tracks
		...
	pending: # points not yet merged in, left over from pair 
		...
	missed: # list of unmerged track views ordered on which track was missed
		- VIEWIDA
		- VIEWIDD
		- VIEWIDC
		- VIEWIDB

...
			count: 
			views:
				- VIEWIDA
				- VIEWIDB
				- VIEWIDC
		- 





TRACK INTERSECTION:
if 2 points in any view are closer than some threshold (1/4 - 1/10 of a cell size)

scenarios: per view
	- INT - both points are very close
	- DOU - points are in fairly different positions
		- use point position with best NCC score
		- use point position which results in closer 3D point ?
	- SIN - single point

compare:


- the 'loaded' view points can change position
- the 'unloaded' view points have to be the base
- if theyre all loaded ... order somehow?










- how to recognize outlier edges/pairs in graph? [assume have passed max Rerror check]
	- before triples are determined/calculated?
	- before absolute orientations are calculated?
	- after initial estimation?
	- voting requires a fair amount of connectivity:
		- node voting [sigma drop worst]
		- edge voting? [sigma drop worst]
	- plotting of all edges in some N-space to detect outliers in some other way?:
		- angle difference, distance, R-error, F-error, ... => then drop anomalies?
		- 
	- others methods?

- how to load points by sections for large scale out of core sectioning
- what to do about points at infinity (project eg white-space sky / unmapped areas to a sphere?)



- graph EDGES should be added to when track overlaps are found / added
=> right now only considering original pairwise matches


- some scenes (outdoors) can have huge distances between areas of interest
	EG: outdoors:
		- local field area is dense ~ 1E1m
		- mountains are sparse ~ 1E3m
		- sky is at infinity ~ 1E9m
	=> size of 'scene' should be focused on where CAMERAS are, not necessarily where the points end up being


- sequence for pair stereogram:
	- as long as error goes down by some amount ((diff)/current > 1-10% ) (not including first iteration)
		- only check on non-lax iterations
	- divide if there's a 'split' waiting
		- 
	
- identifying errors earlier on to prevent further estimations

- if stereopsis error goes up ... not a good sign

- lots of proceeded bad matches ... higher constraints for matches?





- ~ 2500 match-pts with 40 cells, 1-4 px sigma error @ 500x350
	- high error but views are in rough correct spot -- POINTS are just not

- double check all normalizing



- throw out initial pair estimates [set to 0] if:
	- initial match count < 16
	- best F error > 20 px
	- best R error > 10 px





- logic for processing skeleton and groups and full BA
	- POINTS ARE CONSTANT [in 2D, but 3d positions do change]
	- VIEW TRANSFORMS CHANGE
	- same points can be loaded for each group (although wasteful for non-skeleton)
	- each group has it's own absolute transforms
		- load in sequence until error goes down
	- absolute transforms from groups to be combined:
		- A) assume skeletal is correct, append groups based on neighbor [or pairs from non-groups?]
		- B) graphwise combining relative pairs
	- reset transforms to origin at center of mass

- logic for increasing point count [fill in / expand] in 
	- VIEW TRANSFORMS ARE CONSTANT
	- 



DENSE - STEP - REMINDER
- use best guess sparse pairs for matches
- use sparse relative orientation to:
	- limit F & R error min[1-5px, relativeError x 2]
	- limit neighborhood search
	- pick affine relationship for potential matches
DIFFERENCE:
	A) TRACKS ARE USED FOR BA POSITIONING
		BUT DENSE ARE USED FOR FINAL POINTS
	B) don't care to predict next best pair set / connectivity
	C) 


OUT-OF-CORE BUNDLE ADJUSTMENT: --------------------------------------------------

- to load by view, each view needs to store it's array of points involved, consistency needs to be enforced across views
- 


A) UPDATING ONLY VIEWS:
	- pick some view [or group] -- (connectivity i & i+1 / i+2)
	- load all points connected to view [or group]
	- include all adjacent views [any reference from a point]
	- update orientate the view [or some central views in group]
	- save updated view orientations

B) UPDATING POINTS:
	- pick small neighborhood volume to load points from
	- load adjacent volume of points
	- load all views referenced from core points [or full set?]
	- mark points to remove as outliers
	- mark propagated points to add

C) INCREASING POINT DENSITY:
	- pick some view (with areas that are empty / or areas that would be good to propagate to OTHER empty views)
	- load all points in view + adj views
	- subdivide view cells [double size]
	- search adj views for collisions
	- ...

=>>> need consistency management between:
=> list of all points referenced by views
=> oct-tree include


OUT-OF-CORE TRIANGLE TESSELATION: --------------------------------------------------
- points can't fit on disk
- triangles can't fit on disk
- edge perimeter? can't fit on disk?
	=> maybe perimeter size is limited by forcing to not expand until closure?
	=> maybe processing group is limited by having a 'focus area' -- peaks at eg 100-1000 edge size?

- handle?: triangles spread in ALL directions ... ?

- oct-space on disk
- edge-list/ priority queue on disk 

: --------------------------------------------------



- update file/info locations
- standardize what data formats are consistently




- RADIAL DISTORTION: - camera image rectification for radial / tangential lens distortion
	- linearCameraDistortion
		- tangental seems very corner-wrong
	- show a inverse distorted example camera image (bench)
	- how useful is fwd / rev camera distortion ?
	- un-distort an entire image
		- lookup map?
	- camera radial distortion retry nonlinear soln
		- how are inverted images used in steps?
			- invert (undistort) images on load
				- mask of INVALID AREAS [can approx with curve?]
				- can use down-sampled mask (1/2 - 1/4 size)
			- undistort points on load
			- K will change? ===> SHIFT CENTER ???
			- re-distort points on save




~ how to handle differently sized images? in various steps of alg? resolution &| dimensions [also rotation of K ...]
	=> load image with resolution that best matches the desired pixel count / density
	=> images are assume to be 'scaled up' to highest resolution of group
~ how many points should be searched for at each step of the process to minimize calculations/time [visualize pixel densities]


- add back BA steps to add points back in via projected searching & neighborhood searching
- more accurate triangle-texture blending locations require multiple images to be loaded at same time


- possible way to find abs location by minimizing DIRECTION error if relative scale is unknown?
- 



- VR transporting --- use left joystick?
- VR rotation more fine angle



- exact image file duplicate can be found with sha sum
- exact image data duplicate requires image loading



- iteritiveEdgeToSizeAtPoint is still just basically random checking

- base angle is OPPOSITE of edge ... what is 60 - beta look like ?

- finding multiple seeds after first one fails/finishes

- re-desiging filesystem & project files with most recent knowledge


project-ID/
	info.yaml 						# cameras,views,current-state-info [sparse,track,dense,BA,scene]
	views/
		ID/
			pictures/
			features/summary.yaml 		# corner-sift feature summaries (location & scale); DoG-SIFT, MSER, histogram color / grad data
			compare.yaml 				# similarity scores for each of N-1 other views
	sparse/
		sparse.yaml 					# summary data for sparse progress
			pairs: ...
			triples: ...
			graph:
				views:
					- 
						id: viewID
						R: absolute orientation
				edges:
					-
						A: viewIDA
						B: viewIDB
						e: error
			tracks: tracks.yaml
			bundle:
				groups: group.yaml
				full: bundle.yaml
		tracks.yaml 					# points for sparse BA -- stays the same (3D points irrelevant)
		group.yaml 						# sub-group BA -- view orientations change
			skeleton:
				...
			groups:
				...
		bundle.yaml 					# full BA -- view orientations change
		pairs/
			pairID/
				matches.yaml 			# F matches
				relative.yaml 			# R matches
				tracks.yaml 			# best relative R P3D
		triples/
			tripleID/
				relative.yaml 			# don't care? only need summary data
	dense/
		dense.yaml
			... SAME AS SPARSE
	bundle/
		bundle.yaml 					# view absolute orientations & groups to load dense at a time
		points.yaml 					# final aggregation of points
		groups/
			group_i_tracks.yaml 		# tracks from 'dense' only relevant to group [10k]
			group_i_points.yaml 		# dense points [50k]
	surface/
		surface.yaml 					# summary data of progress: views, points, triangles, textures, packing
		points.yaml 					# surface points
		triangles.yaml 					# triangles
		textures/
			tex0.png
			...
	scenes.yaml
	scenes/
		sceneID/
			scene.yaml
			textures/
				tex0.png
				...

info.yaml:
	title: "New Project 11/9/18 9:12AM"
	created: "2018-11-09 09:12:31.9000"
	modified: "2019-11-30 07:44:19.9290"
	views:
		-
			title: "New View 25I42TL0"
			id: "25I42TL0"					--- CHANGE FROM DIRECTORY
			camera: null 					--- should hold ID
			rotated: 0						--- ADDED FOR: 0 90 180 270
			aspectRatio: 1.3333333333333333
			mask: null
			features: COUNT					--- CHANGE FROM FEATURES.FILES.STRINGNAME ???? --- null / value determines if it is done yet
			???duplicate: false
			pictures:
				-
					file: "100.png"
					width: 2016
					height: 1512
					scale: 1
	cameras:
		-
			directory: "LA8ADU8H"
			title: "New Camera LA8ADU8H"
			calculatedCount: 10
			K:
				fx: 0.8565143769157422
				fy: 1.1625998022448123
				s: -0.012439315192795274
				cx: 0.4781381185245835
				cy: 0.4746370298801608
			distortion:
				k1: -0.012203124117497414
				k2: 0.0007660455391699547
				k3: 0.0005320068206907417
				p1: 0.017459785333744926
				p2: 0.014415011981151046
			images:
				-
					directory: "L9THUQ4M"
					matches: 81
					aspectRatio: 1.3333333333333333
					pictures:
						-
							file: "100.png"
							width: 1008
							height: 756
							scale: 1
						-
	viewSimilarity:
		-
			A: viewIDA
			s: (HISTOGRAM SCORE | AVG FEATURE SCORE | ...)

	sparse: sparse/sparse.yaml 				# lower-res initializing of pairs / triples / graph / absolute
	sparseCount: # 

	dense: dense/dense.yaml 				# higher-res pair / triple / graph / absolute
	denseCount: #

	bundle: bundle/bundle.yaml 				# fill-in absolute / triangles / textures
	bundleCount: #

	scenes: 								# copy of last step of reconstruction
		-
			id: ID
			?


surface.yaml
	points: points.yaml 					# fill in points [2d & 3d propagation]
	triangles: triangles.yaml 				# create surface
	textures: textures.yaml 				# update surface & create textures




	graph: "graph.yaml"

	tracks: "tracks.yaml"
	trackCount: 4816

	sparse: "sparse.yaml"
	sparseCount: 2704

	dense: "dense.yaml"
	denseCount: 108024

	points: "points.yaml"
	pointsCount: 68212

	bundle: "bundle.yaml"
	bundleCount: 1,234,569

	surface: "surface.yaml"
	triangleCount: 8337
	textureCount: 2

	scenes:
		- "ABCDEFGH"



view/ID/
features.yaml:
	view: ID
	created: "2019-08-05 17:58:51.7730"
	flatHistogram:
		0-0-0: 0.0012
		...
	flatHistogramSize: 10
	wordCount: 100
	words:
		- 
			x: ...
			y: ...
			size: ...
			angle: ...
	featureCount: 1124
	features:
		-
			x: 0.03286579033039629
			y: 0.025841308349525773
			size: 0.031633061047733495
			angle: -2.8001512423754815

sparse.yaml //// 
	cameras:
	views: 				--- skip any views not worth checking ...
	pairs:
	triples:


sparse/
	pairs/
		ID/
			matches.yaml 	--- F matches
			relative.yaml 	--- R matches
			tracks.yaml 	--- best R matches [1K]


tracks.yaml 			--- REPLACE existing sparse file

dense.yaml
	cameras:
	views:
	pairs: 				--- potential pairs to be estimated based on closeness / viewing angle / 
	triples:

dense/
	pairs/
		ID/
			relative.yaml 		--- R matches


points.yaml
	???

bundle.yaml
	???

triangles.yaml
	???

scenes/
	ID/
		scene.yaml
		textures/
			tex_0.png
			...
		snapshots/
			shot_0.png
			...
		views/
			ID.png
			...


scene.yaml
	created:
	modified:
	views:
		- 
			id: 
			transform:
			...
	cameras:
		- ...
	vantages:
		- ...
	surface:
		vertexes:
			- ...
		triangles:
			- ...
	textures:
		- ...
	snapshots:
		- ...



- bundle adjust single file of points [view index format]

- 







	...

- way to push camera views towards each other by knowing relative offset of a set of points?
	if Pa & Pb are supposed to be the same point
		-find some relative transform from a set of points
	=> tracks of length > 2 ???


- points file to bundled file

- wrong file format for loading view iDs / indexes ?

- bundle adjust reduce error
	- loading images?


- reduce points by averaging points ?






- DENSE PAIRS MAY NOT HAVE SPARSE PAIR ID --- THESE TO BE DETERMINED AT LATER POINT ... POSSIBLY SEPARATE FIRST STEPS OUT MORE


isPointTooClose

	x putativeTriLocalEdges

	? intersectAnyFences

	? closestTooCloseEdge


ear cut -- is just merging with adj 2-edges either side

too close / intersection testing: --- isPointTooClose
	- too close to edge
	- too close to tris
	- intersects a fence
	... CLOSEST FENCE





-  triangles seem like they may need a step to do edge-swapping 




- BI-DIRECTIONAL ERROR FROM NORMAL ?
	- 
	
	- bundle adjust + propagation at same time now [loaded view + NN projecting]

	- load images for BA
	- probe3d to views with loaded images

	- update/new track merging code for summary statistics check
		- check 
		- make sure summary statistics aren't re-updated during process
	- VERIFY BA IMPROVES OUTPUT


	- error on abs view locations is bad
		- go back and add triple scaling




- estimate exponential curve from pts -- fitting to volume percentage curve, so only need a few points, and does smoothing
http://mathworld.wolfram.com/LeastSquaresFittingExponential.html
A * exp(-B * x) + C


- ALL merging solns should use affine location method [or needle/haystack] for adj view 2D locations
	- is NCC used before a match is even made ?

point merging scenarios:
	- F only
		- without an R, don't have affine
		=> this should ONLY happen in pairwise
			- an inetersection in this case implies a point is either exactly overlapping OR 2 points are mapping to same place
				=> can just pick better match & throw other away?
	- pair/triple:
		- logic?
		- ?? IS NCC CHECKED BEFOREHAND?
	- merging long tracks / propagating:

		- logic?
		- check global SSD before adding
		
		- don't need to save/generate SSD/AFFINE -- can figure that out at merge time

++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

-> decisions:
	- dont record ncc/sad for each point
	- do record summary statistics for every (known) pair 
		- when combining tracks, only thing that is checked is that the new ncc/sad score is better than some sigma limit of the would-be transform
			- the 2 views of projection are present to get this score
		- if a new pair (transform) is added during BA : the summary statistics are initted as the average of it's kNN ( first adj views when point count > #)





- only need ncc/sad match data in order to decide if a projected point is good or not
	- can keep pairwize ncc/sad sigma info (already tracked)


- how is the track point projection working w/o match data? -- assuming already loaded?




-> need to allow saving of match ncc/sad data 
-> ncc/sad needs to be played nice with when added externally
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

- is there a way to add a lot of surface detail after the fact?
	- project new points ???
	- need to drop/merge superfluous points [identify planar spots?]
- how to load 'sections' of the volume at a time
...



- doing point propagation isn't really possible after points are unified
	- ncc matches aren't available for views where image is not loaded
- propagation beforehand:
	- triples? / N-ples
		- lots of duplicated points
- limited propagation during:
	- can only extend / match points that have views already loaded
	- ...

- goal of propagation:
	- finding more support for a point pulls model toward correct spot
	- if points are removed during error reduction, there will be open areas

- FILLING ?
	- can only fill in / join areas that are all loaded
	



STEPS:
	- dense pairs
	- aggregate pairs into world + combine tracks
	- bundle adjust + optimize
		- view optimizing orientation
		- remove obstruction matches [delete points]
	- filling
		- identify 'holes' in images where objects 'should' be [no obstruction]
		- load select set of scene images
	- propagating [can only propagate tracks of images that are loaded]
		- project point 
		- load select set of scene images



--- maybe propagation can only occurr before merging?
	- pairs & triples ?

- can store global NCC/SAD limits for each pair ?

- how to do propagation without some images loaded
	== don't have ncc/sad avail for most matches
	== not able to filter poor matches on ncc/sad
	=> can a score be inferred?
	- not able to merge ncc/sad scores? [unless all views are present]
	- else: how to tell if good match?

- add step for combining the pairwise points into long tracks ()

- new dense points:
	- need to load the view images
	- need to recalculate the point factors of each point pair:
		- P3D
		- normal
		- size
		- matches:
			- ncc
			- sad
	- stored tracks should include all these pieces and generate from 
 match ncc & sad is a lot more data
 	- try to work without this in propagation & BA ?
 		- propagation: needs to discard points by quality of matches
 		- BA wont be adding more points -> filtering primarily on geometry
 	- ncc & sad needs to be preserved in various scenarios
 		- merging
 			- new matches will not have scores possible

-
		X: -8.8
		Y: -8.6
		Z: 22.7
		x: 0.36
		y: 0.32
		z: -0.8
		s: 0.10
		v:
			-
				i: 0
				x: 0.18
				y: 0.05
			-
				i: 1
				x: 0.014
				y: 0.01
			-
				i: 2
				x: 0.02
				y: 0.03
		m:
			-			# assumed 0-1
				s: 0.01
				n: 0.02
			-			# assumed 0-2
				s: 0.10
				n: 0.05
			-			# assumed 1-2
				s: 0.19
				n: 0.14




- iteration steps to spread / expand via projection to other views
	- limiting to best candidates

- start bundle adjust from just points ....
	- metric for tracking view update progress [R error across pairs?]

- make simple 2d pt intersection using only affine data [no images loaded]
	- ...

- WORLDWIDE PATCH INTERSECTION OUTLIER TEST FOR RANSAC 







------------------- > POINT COLLISION RESOLVING
goals: 
	- keep bad match from taking down a good match
		how to tell if it is bad?
	- better precice localization of points that are only 'close' eg: 1 px off
		small differences in pixel accuracy (esp when cell size is halved) can lead to unnecessary larger error in R

	metric: see if R error after the fact is better or worse? --- need global R error??

- 

- if at least 1 intersection view is not loaded:




possible intersection scenarios:
	- disjoint views [only one point]
	- 2 point, overlapping
		- choose centerpoint [0,1,2 images]
	- 2 point, not overlapping
		=> need to choose 1
			- both images loaded [2]
				=> choose point with better matching to intersection point
			- 1 images loaded
				=> ?
			- no images loaded
				=> choose point that would result in lower R error ?
	update:
	- for all loaded images, pick optimized location that matches intersecting points?

no images loaded:
	- ?

if A & B have no common subviews -> error
if A or B is subset of views of the other -> insert 'better' point (R3D / NCC error)


.............. keeping location accuracy even without (some) views loaded:
	- one of the points to become the 'reference' point [more points, lower N error, lower R error]
		- optimum location found via 2D haystack search [1, RError, 3]
		- assumed location in other views found affine mapping difference
	- know the affine location






EXPAND:
	- load pair images + support images at a time [3-6] + world point data
	- project P3D to unknown views
		[how to get a list of CANDICATE projection possibilities?]
				- get view frustrum + avg/max z depth
				- get content overlapping ellipsoid
				- facing similar directions
				- 'nearby' geometrically - neighbors
				- has fewer neighbors than average
				- views with direct dense edges were likely already searched well [& points merged]
			----- sample points in view [100-1000 pts]
					- find all views pointing in direction & not occluded
					- look at relative percentages of all views reached
	- ? no other optimizing ?
	=> output to .bundle file [views + points]
BA:
	- only load world point data
	- pick view and optimize location
		- order views based on previous average/total R error reduction
	=> output to .points & .views?






- determine correct patch size for affine generation
	- fastest way to get ?
- how to get a 'frustrum' of a camera: get 2D image plane in 3D space (apply camera transform to get 2D loc, then pass a ray?)


sortCompareProgressiveDropWorst



PATCH SIZE 2D VS 3D / CELL SIZE
patch3DFromPoint3DCameras
patchAffine2DFromPatch3D


- look at physics for examples of 3D mass distribution / rotational moments

- objectProgressiveR3D was changed -- blind matching needs to be rechecked






- REVISIT LOGIC OPTIONS ON 2D collision senarios:
	- with images [pair,triple]
	- without images [full dense]
	- e/o: patches



	=> SCENARIOS:
		- pairwise (image)
		- combining tracks? (images?)
		- groups (some images)
		- full dense (no images)



- DENSE LOGIC:
	- loading pairs again?
		- where do points come from --- original grouping may not exist? be poor?
		- are final tracks added anywhere?


- CAN FIX ONE CAMERA TO OPTIMIZE LOCALIZATION OPTIMIZING 


	- load small groups?
		- only update/add pair points in a single pair?
	- 

	=> START FROM SCRATCH?
		- have well defined F (angle) & R (projective / sizing)
		- find corners/features
			- in A: angle = 0
			- in B: angle = F-line ????
		- limit search by:
			- error window along F line
		- check match:
			- get 3D predicted point
			- get projection/affine (relative angle / size)
				-- unit sphere @ 3D point gives relative size
				-- unit 'up' gives relative angle 
			- extract expected projection from image B
			- compare affine-extracted patch


		- once best matches are found, relative R can be updated using best inliers (25-50%)

		- LOOP:
			- 2D probing
			- error updating
			- dropping worst R / F / N
			- R / F updates


















- check 2d & 3d angle COM via complex number adding
=> wrong ... why?



- 3D version of point neighborhood






- maybe all the SVD solutions need to be converted to A^-1 * b = 0 ...














gradAngleFromGry3x3

progressiveSparseDenseMatches

progressiveMatchChooseBest





~ ORIENTATION
x cov of 9-grid
x simple gradient from dx & dy in 9-grid (4 points)
x highly averaged covariange
x highly averaged gradient
x direction of max gradient from center (abs,binned) 8 & 16
x separate covariance averagings
x separate gradients averagings
- 4 covariances from 9-grid?
- full on covariance of entire area?



A) Stereopsis
	- tracks



calculateBundleAdjustTriple
solveTriple

calculateGlobalOrientationInit

iterateSparseTracks

iterateDenseTracks

iteratePointsFullBA


B) Stereopsis to use image scales [more]



C) HANDLING FAIL SCENARIOS
	- pair F error too high [5-10?]
	- pair R error too high [5-10?]
	- triplet?



- still missing consistent matching of close views [hit or miss]
	- way to help force matching in unmatched regions?




- what is the merging point logic for A) images loaded, B) images not loaded?




=> 3D noise dropping
	- 3d kNN projected hull voting
		each projected p3d votes if p2d.p3d is in hull
	- go thru each p3d and if votes >
	- drop where most neighbors say bad


=> neighbor statistic voting? 2D vs 3D ?
	- F error
	- R error
	- M error
	-> 2D: ...
	-> 3D:



- isolated regions:
	- plot knn / distance & look for large jump -- derivative peak >> 2x other peaks


=> predicted missing points propagation?
	- find areas of unmapped 2D locations
		- interpolate from nearest neighbors ?

--- RIGHT EAR STILL SHOULD BE PROPAGATED TO THO
=> VISUALIZE THIS?
	x F error
	x R error
	- M error
	- propagation cell scores (active/inactive)







- FEATURE MATCHING RATIOS:
	- filter best matches by score / ratios after the fact ?





- rules for determining which spheres to drop:
	- notion of support?
		- all points in 2D neighborhood with gradual change in depth
		- larger groups preferred to spotty points

=> check sphere dropping algorithm
	- optionally allow GLOBAL points too
		- how does this work in multi-faceted complex world?


- look again back at voting:
	- dropping 2D / 3D distances
	- ...

	filterLocal2D
	filterLocal3D

- 3D groupings => vote if missing in 2D inner hull


- maybe due to camera position/angle errors ; initial location will be poor
	=> need to wait for 2nd more accurate global round
- some kind of bottleneck?

- not propagating to ears ... ?
		=> THE COLOR IS GRAY --- BG problems ?
	x M SCORE DROPPING
	x score compare metric?
	x range of search region?
	x neighbor of choice (best vs closest)
	~ propagation error limits
	- normal estimates ?
		=> affects affine
	x maximal NCC / SAD scores ?
	- affine: scale + rotation |vs| 4-pt average
	- compare size ?
	~ sphere drops
		=> are discontinuities subject to more ?


	=> other dropped match reasons?


- issues with sphere droppings ?



=> affine estimated from local projection neighborhood?
=> normal estimated from local 3D ~ plane neighborhood ?

filterPairwiseSphere3D





- back to scattered 3D point distance dropping


=> is there a way to get better spread of points ?
	=> want more corners for 2D to search from
- 2D match filter on RIFT / NCC score



- middle-ground to optimizing patch normals?

- neighborhood plane estimating for normals?



-

patchInitOrUpdate
	this.updateP3DPatch(point3D);
	this.initialEstimatePatch(point3D);

		updateP3DPatch

		Stereopsis.patchNonlinear(center,size,normal,right,up,moveDirection,visibleViews,point3D,doTranslate);

Stereopsis.World.prototype.updateP3DPatch = function(point3D, doTranslate){


--- need to detect when affine propagation stops (goes real low ?)


--- when to subdivide?:
	- when change in F & R errors are becoming ~ minimum
	- when propagation is leveling out (will always have some delta drop/add ~ in/out)

...
	probe2DNNAffine
		bestMatch2DFromLocation
			bestAffine2DFromLocation
				R3D.bestAffine2DFromExisting
					R3D.bestAffineLocationFromLocation

=> check cells & space are working well together



/*
only worth spending time on cells with fairly good corner values
how to prune bad 2D / affine matches ?
*/

- stereopsis not propagating seeds into all spots
	- maybe allowed have more than allowed error ...
	=> WHY?
- different ways to do affine comparing cells? A v B v AB


STEREOPSIS PROBLEMS:
 - probe2DNNAffine very slow
 	[should also use scaled image version]



- use scaling images in stereopsis ??? (small cell sizes shouldn't see any benefit)





FOR CHOOSING TRACK POINTS:
	- choose among corners inside mapped cells A/B [valid areas]
	- keep top 1/2 of best: corners, ferror, rerror => = 1/8th




- not enough seeds in the correct places
	- need seeds everywhere

- can get rotation from best F matrix
- missing good scale
	- could get this from the camera R [need K]













MORE INVESTIGATIONS:
=> LARGE SKEW DIFFERENCE BETWEEN FG & BG OBJECTS
=> DOES NOT VARY SMOOTHLY ...
	- location
	- affine
=> need way to compare areas that is not oriented / strictly oriented
	- color histogram
	- color-gradient histogram
	- SIFT aligned with F


.... may need to go back to seeds ....
	- if an 'originating' seed is removed => cascade remove all decendants?

- in stead of finding dense ...
- use good F to find new set of best matches, using oriented F SIFT OBJECTS


- progressively up density



x plot all F relative normals/angles in A & B
x plot rectified images

- try to make optimized skew ?




dense:
- still poor matching
	- incorrect existing 2 points


=> OBSERVATIONS:
	- initial placement has a much different skew, so the correct match is poor
	- a nearby point is an incorrect match BUT accidentallly better affine skew match

=> initial matrix needs to be much better



NEXT?

=> IS DOING THIS IN RECTIFIED DOMAIN BETTER ?

=> BAD PLACEMENT
=> BAD ROTATION






--- what's causing poor matching?
	- original Fs?
	- params?
	- ... F - orientation? [assumed rotation]?
		- affine?

- WATCH: first steps vs last steps? - progression of process

- second step of matching is the DENSE STEREO
	- is this OK?

- way to allow for occlusions to be detected / disregarded during optimizing location process?




R3D.objectProgressiveR3D

R3D.objectProgressiveR3D_Z

- R3D._progressiveR3DFlatSIFT
- R3D._progressiveR3DFlat

progressiveR3DColorAverage


R3D.searchMatchPoints3D




progressiveStationaryFeatures





- import scaling image logic for
	- PROGRESSIVE SIFT IMAGES
	- stereopsis cells (maybe OK atm with cells on same size as image source)



- auto calibration: arbitrary images => K - many views to constrain H
	- Pab = [[e_b]x F | e_b]
	- P ~ H * Pab
	- p = -(K)^-T * v
	- H = [K 0 ; -p^T * K 1]
		=> 8 unknowns
	- absolute plane
	- abs conic
	- projective factorization
	---- https://www.tnt.uni-hannover.de/papers/data/407/ACCV06_TTHBPM_1.pdf
	---- http://www.csc.kth.se/~madry/courses/mvg10/Attachments/10_Presentation_Alper.pdf

- self calibration: use some input images with known constancy (eg position / rotation / GPS / gyroscope) to determine K

- calibration methods:
	- vanishing points
	- KNOWN parallel | perpendicular lines
	- TFT
	- factorization: W | SDV | R & Q
	- dual absolute quadric

- simplifications:
	- K no skew, square pixels, optical center = image center, no distortion
	-

- use basic R to approximate AFFINE matrices between points between A & B
	=> rotation & scale


- allow for unmatched portions
- use image derivatives
- incorporate PM randomized sampling (& use if better approx.)?
- simultaneous FWD/BAK matching ?
- perturbation in stereopsis to allow for picking slightly better cost / parameters ?


- intermediary surface reference for normal / etc
- move noisy points toward surface ()
- depth outliers []

- CLEARLY NOISE P3D
	- neighborhood 3D distances is sporadic
	- compared to what?
		- not 'locally'
		- global average distance range /


	=> there is a P3D very far away from any other 3D points, why not being dropped?
		x not in anyone's way
		- 2D-3D neighborhood is all over the place
		- 3D-neighborhood is all over the place
			=> 3D/2D distances of 4-8 neighbors

- how to get rid of incorrect noise points in 2-way ?
	x in front of eachother
	~ R-error
	~ F-error
	- pairwise 'global' average estimate of neighbor distances
		~1000 sampled points in transform pair
			record metric:
				average 3D / 2D distance ratio to k neighbors [8-12]
					- allows for comparison of sparse and dense samples
				divide by depth (distance from cameras)
					- further points are expected to have

		=> far points means sproadic
		=> what does very close points mean ?
	- other ways to target-remove clumps of bad points - isolated single-points & small groups
		- ?


	- drop points who's average distance >> 3 sigma


	- 2D neighborhood of 3D distance outliers
		- EACH POINT x ~10 neighbors = 100k

- clumpy behavior, especially distant
	- allow for local 're-search' to pick point more-better aligned with F / R
		- how to avoid just picking a point that fits but isn't correct?
	- ...

- planar artifacts from 2D F sampling


- pairwise goal:
	- drop worst scores while maintaining connectivity
	=> filling in details is last step in process

- how do pairwise & allwise match-obstruction compare?
	- does pairwise actually do much?
	- does allwise have a 'size' that works globally?
		- is this fast/slow?


- non-patch combining again

when inserting points - why are A/B negative from dense grouping?



- how to decide if a dense recon is good / bad ?
	- avg reprojection error ...

- test in pipeline process
	- pairwise matches


http://localhost/ff/3DR/app/app.html?mode=image

http://localhost/ff/3DR/app/app.html?mode=model



- debug epipole in image: BENCH C & D



PIKANICE:
105622/(504*378) = 55%

COUCH:
46912/(504*378) = 25%

BENCH:
27998/(504*378) = 15%

HOUSE BAD:
24737/(504*378) = 13% [only possible 70% => 18%]

HOUSE GOOD:
5738/(504*378) = 3% [only possible 25% => 12%]

PIKABAD:
13120/(504*378) = 7%




- identify discontinuties:
	- plot parent distances
		: B / A
		actualA / expectedA

- group / use inlier parents
	- top 3-5 inliers [expected length == actual length]


- use mapping to restrict sparse matches to area???






- SEEDED MATCHING SPREAD ... ?
	- VERY SIMILAR to spread


- good visual matches don't seem to have quite enough fwd/bak matches
	- what does the basic distance interpolation look like ?


.....




- try optimizing individual steps:
	- initial orientation:
		x location from average displacement
		- rotation from average F-angle [subsample like 10-100]
		x scale from average scale [in log space]
	- subdivision
		- estimating search point(s)
			- including correct neighbors
			- avoid neighbors across discontinuity
		- optimal location
			- best choice
				- fwd/bak check ?
		- optimal orientation
			- averaging
	- regularization
		- which neighbors to include
			- avoid neighbors across discontinuity
				- (distance ?)
	- smoothing disparity
		- median filter


- determine best predicted location:
	x search each of 4 possible parents
	x pick parent / location with lowest score
	- inlier parents

x determine which neighbors to use for regularization
	x list of B/A ratios
	x max-min, keep all under avg (or mid)


- plot motion field


- forward/backward chosen priorities?

- motion field rather than / in conjunction with affine ?


- discontinuities cause invalidation or some such

- searching for points along discontinuity should check A or B
	=> how to identify discontinuity ?
		- look at relative distance of ~9 neighbors, if closest half & farthest half ratio > ~2
	=> how to react to discontinuity

- what do do about F rectified looping around ?
	- find smallest (valid)value in rowA -> this should be the 'start?' of A?

=> rectified lines aren't matching up too well
- could F be re-estimated using fwd/bak kept points?

=> could this method be used earlier on to get good F?



- mbda * (summed average location) + lambda*(predicted location)
- SPEED UP LAST STEP
	- dont do any matrix averaging

- DROPPING POOR SCORES
	- invalidate cells with neighborhood score >> rest





- ways to get around path non-finding
	ANY path ending at: i-1,x : x <= i+del-1
	ANY path ending at: x,i+del-1 : x <= i-1

		lookup table: A
			sorted on B
				-> lookup first index for B<=i+del-1
		lookup table: B
			sorted on A
				-> lookup first index for A<=i-1

	FINDING PREDECESSORS: [up to N]
		A predecessor:
			for each entry in A starting at i-1:
				binary-lookup to find first index ending at B<=i-del-1
					grab all previous entries up to N count
				if count >= N
					break
		B predecessor:
			for each entry in B starting at i-delta-1:
				binary-lookup to find first index ending at A<=i-1
					grab all previous entries up to N count
				if count >= N
					break




	++++ALTERNATE++++
	- refine fwd-bak match locations
		- alternately: search area can be reduced to ~10% radius around matched points
		- use as seeds
	- use as seed points in cell propagation
	- ...



- [invalidated are ignored during division - propagation]
	- invalidate matches that go outside imageB
	- invalidate matches with poor scores

- at small enough scale affine can be determined by locations of neighbors A->B
	- blend/ignore inherited affine matrix

=> regularization of new cells [~50% from predicted, ~50% from expected]
	- after predicted points are found ... some manner of averaging with expected locations

- why is constrained F worse than free range?
	=> large scale objects have a lot of distortion, and the average location might be far off the central F-location
		=> might need to wait to use F until the cell sizes are on the order of the F-range pixel error
	- debug:
		- show search ranges
		- show matched locations

=> F should be used as much as possible to A) search more-correct locations & B) reduce search spaces
	- predicted location clamp to F [+/- pixel error]
	- search range only along F line [+/- pixel error]
	-

- maybe cell comparison size should be a little larger than the cell ? => would this help with making things more gradual ?

- output final matches

- forward backward match checking

- final sub-pixel localization speed ups?




2nd step?:
	A) seed dense stereo disparities
	B) cell seed point propagation from first step



- 1:1 rectified image stereo
	- collapse multi-mapped rows
	- repeat
=> does using this help speed up search ?





- some key points to base searching algorithm on:
	A) 'up' predicted by F should be very accurate [under 10 deg]
	B) searching direction should be primarily along F line (+/- pixel error in Y)
	C) at each iteration, 'affine' transform should be fairly accurate [only require tiny distortions locally]
	D) the more refined the search size, the smaller the distortion error is expected to be [~halving]
	E) affine transform can be determined from 4 local points location searches
		- points outside image A / image B cannot be considered [try inside-local size, eg: 1-10% of image]




- instead of finding best transform of AFFINE IMAGE:
	=> use 4 corners to find best LOCATION
	=> infer affine transform from 4 corner points


- seeding prioritization:
	- distinctiveness
		- color differentials
		[allow for not selecting a gradient before a corner]

- compare ACTUAL BEST POINT W/ REACHED BEST POINT

- try 'exhaustive' range check to see which is better


- smaller search range as cell size gets smaller on each division

ImageMat.prototype.extractRectFromFloatImage = function(x,y,scale,sigma,w,h,matrix){

ImageMat.extractRectFromFloatImage

var img = ImageMat.extractRect(imgSource, TL.x,TL.y, TR.x,TR.y, BR.x,BR.y, BL.x,BL.y, wid,hei, imgWid,imgHei);





Nelder - Mead
http://www.scholarpedia.org/article/Nelder-Mead_algorithm
https://www.scilab.org/sites/default/files/neldermead.pdf
https://github.com/huttmf/nelder-mead
http://www.jasoncantarella.com/downloads/NelderMeadProof.pdf
https://en.wikipedia.org/wiki/Nelder%E2%80%93Mead_method





- image alignment
	Lucas Kanade alignment http://16720.courses.cs.cmu.edu/lec/alignment.pdf
		- gradients?
			- manual hessian & gradient
			Lucas-Kanade 20 Years On: A Unifying Framework



The simplex search algorithm (Nelder and Mead, 1965)
https://www.scilab.org/sites/default/files/neldermead.pdf


Newton-Raphson



- radial gaussian window

- cost function - convex finding minimum
	- SSD ?
	- MSD MEAN SQUARED DIFFERENCE = 1/N * SSD
	- normalized mutual information
	- CR - correlation ratio
	- joint entropy minimization
	- mutual information maximization: MI(I,J|T) = SUM_i,j p_i.j * log ( p_i,j / (p_i * p_j) )
		- maximized joint histogram is 'sharpest'
	-
...
http://www.cs.ucf.edu/~bagci/teaching/mic17/lec16.pdf
minimum entropy registration
maximum mutual information registration





- CONFIRM that stereo is bad because of high differences / disparity by testing more similar pair:
	- room0/room1



AFFINE OPTIMIZING:
	- separate:
		- find location
		- rotation
		- scale
		- skew
	- all together: affine ... can


- affine hierarchy
	- optimized affine all 4 params
		-> fwd/bak might help force same scale?
	- optimized affine w/o scale [angleX & angleY]
	- optimized affine only scale
	- test: w/ & w/o blurring ?
	- regularization:
		- final cell location:
			- average of all neighbors: (predicted location) * (SAD score)
	- searching for needle in haystack only along F-line



	final step [1024,4096]
		- needle/haystack @ 3-5 pixel size
	pixel step [4096,16384]
		- +/- 1 pixel  w/ extrema ?

	- poorest matches (based on neighborhood) are set as occluded & not pursued [outside 3 or 4 sigma]


- sparse->dense via region growing
	... may beed to go back to this

	- candidate matches using known F
	- prioritize distinct points
	- optmiize affine fransform
	-






- search needle along haystack LINE in B
- refine affine using nonlinear searching with ~10 iterations
- add regularization w/ error averaging
- points fully out of image A/B => not processed / rendered
- points with poor match score (relative to neighbors) => dead





- stereo with occlusion penalty is poor for large occlusions
-- early propagated disparities are bad ....
	- try scaling only in x direction ?
- need to rotate final images in hierarchy before matching if opposite rotation

- retry fwd/back without ordering constraint
	-> ideas for handling accidental repeated ?


--- try creating 1:1 mapping between rectified images
	- list of all 1+ mappings, collapse to average, repeat till none








-> TEST PIPELINE DENSE-MATCHING FALSE POSITIVES


- bring corner finder into loop [changing F changes relative orientation -- ADD CHECK FOR RE-GETTING ELEMENTS ONLY IF RELATIVE ANGLES ARE > ~10 degrees]



- FOCAL LENGTH FROM FUNDAMENTAL MATRIX [assumed principle points]
	-> get approx P
	-> get approx relative image-space-scales



- way to find out if SEGMENTS of stereo-dense-F are valid ? -- ignore poor ends
--- way to ignore ends of rectified pairs ?



-- STOP ITERATIONS if error is not going down in iterations - errorNext/errorPrev > 0.95 ?




- disparity on rectified images [row]



B) remove clumps of incorrect matches
	=> identify bad matches in 3D space somehow
	---- might be accidentally 'good / low erro
	- eat edges?


- initial dense F has large error
	- use first/second score ratios [keep top half ?]

- probe2d searched cells/points criteria

- how to verify if patch dropping is working?

- identify / remove small disconnected (bad) neighborhoods
	- 'expand' locally



- look back at radial distortion minimizing
- look back at guessed K minimizing

- camera distortion / center




- image blending: gain offset, multiband sigmas
...



- patch sphere intersection seems high ?
	=> visual display of cone intersection (2D?) validness ?
		x random points in 3D on x/y plane
		- internalize fxn that returns list of matched cone items
			- 'expand' by radius * 2
		- display all points, potential points, final points


- probe2D working?
	=> visual display of achieved points [location in image A with extract from image B]






- probe2d more accurate
- probe2d searched points criteria
- probe2d use smart haystack sizing
	- make lookup image when cell size changes ...


- HOW TO PRIORITIZE PROBE2D CHECKING SMARTLY - ADD  & REMOVE
	- can't be the case that every border cell is re-checked every iteration
		=> poor matches will repeatedly throw error | progress in knowledge is not made
	- keep track of only border cells:
		- add: remove included cell from list, add empty neighbors
		- remove: add now-empty cell to list
			=> only recheck if error

	..

- RECHECK:
? filterPairwiseSphere3D
? probe2DPairwise
	matching:
	? COLORED NCC / SAD ?


- using dense stero - cell size needs to be tiny to accomidate (on same level of approx)


- patch sphere sizes need to be more accurate ? up/down/left/right
	- how do different resolutions of images account for this? in K
		=> use percentages going forward? conversions might be everywhere
- double check probe2d gets edge cells & only propagate to good locations (F / R / N)

	- print out some CURRENT POINTS & PROJECTED NEXT POINTS

- some way to drop groups of bad points & not the good points?
	- how to get around groups of sphere-patch collisions both saying eachother is bad
		-> allow for re-propagation somehow?


- try using dense F results turn to matches
	- can use lower resolution for testing




local probe2d seems to be stopping prematurely
	- other criteria is dropping points?
		=> sphere/patch interference between 2 clumps is dropping both the good set and the bad set

why is this higher:
	probe2d changed points to blank points:
 	4596 => 4959

- try to rescue point dropping by using sphere intersections

-- need this to run before probe2d


--- matches2d have a patch size (in respective transform) so do point3d



- some initial corner matches are WRONG
	- use a score ratio to pick among clear matches
		=> for points that don't necessarily have a match

		( THIS DOESN'T ADDRESS LARGE GROUPS OF BAD MATCHES - systemic)
	- perhaps do 2D neighborhood picking to identify points very far from correct neghborhood
		- source 2D distances / destination 2D distances
			[scale for each point]
		- for each point:
			- get variation in neighborhood (~8)
			- if point is over ~2 sigma from neighborhood variation
				-> mark as outlier


- do dense F again instead
	- use initial points from R to get better F
	- rectify
	-



- patch size is wrong in R3D
- migrate R3D code to Stereopsis?



0 is there a way to do dense R similar to dense F ?
	- distort image in some way ... in all directions


- something wrong with probing ? along x=y ?



bestMatch2DFromLocation => use R3D fxn




queue2d are filled with every cell that was updated: removed / added

probe2d cares about all empty cells next to filled cells


WHICH PROBE@D TO USE?:

probe2DNNAffine
probe2D


- expand 2d
	- ways to speed up process?
		-
		- 2D matching
		- limiting searching areas
			- on reset: [only filled block with 1+ blank neighbors]

		=> on probe2d:
			- only want list of empty blocks & source predictor [for each view pair]




- match process is still very slow


- matching corner points => seed points
- test initial seed points in model viewer
- probe2d increase density of points [only drop very high error: 3-4 sigma]
- test points in model viewer
- probe2D + refinement /error dropping
- test final points in model viewer


- dense iteration with (initial) R unchanging to start
- saving dense pairs

- group dense pairs into single file
- dense iterate: probe3d projection & probe2d to increase overlap | drop poor R/F/N/S
- dense BA
- dense save to points file


- does using 'inbetweens' help in histogram comparison ?


B) review steps of probe3d projection / affine / haystack / scoring
	- haystack size should be based on error
		min = needle + 3
		guess = needle + 2*(rMin + rSig)
		max = 2*needle
	- scoring
		...
GET TO DENSE MATCHING ...
	- ...
		- for each dense.yaml pair to attempt:
			- do initial feature matching
				- align with R
			- iterative:
				- 2x:
					- refine 2 views
					- expand2D
					- refine 3D points
					- filter F/R/N/S
					- filter patches
					- filter ...
				- half cell size [2%->1%->0.5%]
			- save to dense/DENSE_PAIR.yaml
		- for each dense.yaml pair completed:
			- load all into single list [minimal info: P2D]
			- calculate optimal graph absolute transforms

		...

		- IMAGE-PRESENT ITERATION?
			- want chance to:
				further reduce error
				further combine points across images

		- BLIND ITERATION?
			- only filter on

		- drop worst points? [under 1-2 sigma?]

		- double point coverage ?

		save final data to points.yaml:
			- cameras
			- view absolute locations
			? - relative errors (transforms can be derived)
			- list of points:
			 	- 3D loc
				- 3D norm
					- view + 2D locations
		- points.yaml
			- find surface
		- surface.yaml
			- view locations
			- vertexes
			- triangles



BAG OF FEATURES
			- bag of features
				- want to quickly discard & find pair matches
					- graduated steps
					- pref non-oriented?
				- file (database) with list of pertinent summary of each image

					images:
						-
							id: ABCD
								- features:
									-
										f: [....] # flat histogram 10-20 entries [non-oriented] - quick discounting
										i: [....] # flat circular icon/histogram 16-25 entries [oriented]
										g: [....] # gradient circular histogram [orientated]

				- for each new added view:
					- load database
					- compute salient feature descriptors [top 100~1000]
					- add entries to DB / save
					- for each other view:
						- calculate best matching feature A<->B
					- a valid match:
						- A) fwd-bak top pair matches
						- B) similarity score above some minimal #
							- C) dynamically estimate what score cutoff point would give the maximum match % to be 50% for any pair
						- D)
					- assign view pair a % of overlap
				-

				a can have a 50% match with b (many to one)
				b can have a 10% with a

				low/0 matches % should be dropped

			 Naive Bayes


			https://www.mpi-inf.mpg.de/fileadmin/inf/d2/HLCV/cv-ss17-0510-object-bow-part1.pdf






- are probe3d matches being discarded by the merging algorithm?


MULTI-MATCH-DROPPING:
	drop the match with the worst score IF:
		- worst > sigma * C / range ; C = some absolute sizing constant (0.1-1 ?)
		- use pure match scores to determine worst match, not view match score averaging

- double check criteria for probe3D including a match
	- NCC
	- SAD

- can additional steps be done between sparse / dense to re-estimate view transforms?
	absoluteOrientationGraphSolve

TEST ABS TRANS ON KNOWN SET:
	R3D.optimumTransform3DFromRelativePairTransforms = function(pairs, maxIterations){



- how to catch/remove/split P3D with contrary matches
	matchcount>1?
		=> look at distribution
			- 2 'humps'?
				: SPREAD / MIN > # (EG 4)
				: REMAINDER_SPREAD / FIRST_SPREAD
			=> WHAT DO STEM PLOTS LOOK LIKE?





- grow/shrink DROP SIGMAS ... (R = 1.5 <-> 2) once very stable point set is achieved progress is tiny
	=> noise is protecting worse points / hiding better points


- method of picking only some subset of all views (FOR RANSAC)?

- newest multi-view points are the highest error points?
	=> print out relative error for points based on match count for each transform
		IN GENERAL:
			better R error (lower)
			worse F error (higher)
			same N error
			same S error

- why are these getting dropped?
- probe3d is also not getting as many new points as would like ...


- don't care about optimizing views that are very far apart? - use closest geometrically views in ransac [skip some transforms]
- letting bad points in as part of probe3d (poor visually match)



QUESTIONS:
	- are tracks being combined correctly? LOAD ALL PAIRS:
		=> ratio of pair to triple to quad ...: 2:4967 | 3:188 | 4:5


		[0, 0, 1348, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 2338, 26, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 2454, 37, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 2610, 49, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 3668, 102, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 4225, 123, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 4806, 162, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 4967, 188, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5633, 214, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6102, 252, 9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6310, 289, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 7457, 348, 18, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 8019, 389, 23, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 9069, 449, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]


		- sparse.yaml camera ids are null

		embedMatchPoints
		embedPoint3D
			=> expect more points to overlap (25%+, not 5%)
	- are (sparse) overlapping points being combined correctly
		- all frames of reference need to be RELATIVE



		NEW:
		[0, 0, 9033, 341, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 7806, 1309, 179, 22, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 7704, 1122, 156, 23, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 7610, 1095, 146, 13, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 7519, 1081, 137, 18, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 7397, 1084, 153, 17, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 7321, 1086, 156, 18, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 7268, 1087, 163, 21, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 7209, 1092, 169, 18, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 7142, 1088, 170, 17, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 7084, 1084, 163, 19, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 7024, 1081, 161, 19, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6953, 1068, 163, 20, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6897, 1045, 160, 19, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6813, 1049, 153, 21, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6749, 1056, 154, 20, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6684, 1074, 152, 18, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6620, 1091, 153, 17, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6558, 1115, 156, 18, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6518, 1117, 150, 21, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6459, 1133, 154, 20, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		...
		[0, 0, 6425, 1095, 114, 13, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6393, 1029, 97, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6355, 1014, 98, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6331, 997, 95, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6300, 991, 93, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6249, 976, 88, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6244, 930, 84, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6206, 918, 74, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6196, 908, 76, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6182, 893, 70, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 6159, 884, 69, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		...
		[0, 0, 5921, 836, 62, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5903, 827, 61, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5877, 834, 61, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5838, 824, 63, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5820, 815, 59, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5772, 815, 59, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5786, 816, 60, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5745, 814, 56, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5714, 814, 54, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5688, 798, 52, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5635, 803, 51, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5611, 786, 54, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5570, 776, 48, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5539, 774, 53, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5511, 774, 52, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5500, 766, 47, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5480, 772, 46, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5457, 778, 46, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5439, 777, 46, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5424, 774, 45, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5412, 774, 47, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5404, 755, 47, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5391, 749, 50, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5380, 746, 49, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5374, 743, 48, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5367, 725, 48, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5354, 710, 47, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5354, 700, 47, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5348, 698, 47, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5336, 697, 46, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5328, 697, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		..
		[0, 0, 5313, 669, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 5288, 660, 39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		...
		[0, 0, 4557, 461, 26, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 4520, 452, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 4502, 446, 27, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 4452, 465, 28, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 4396, 458, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 4364, 453, 24, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		...
		[0, 0, 3933, 308, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 3902, 303, 14, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 3876, 302, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 3806, 294, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 3796, 291, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		[0, 0, 3792, 290, 17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		...
		???



		....

		...
		make match ncc scores more lenient ...

		...
-


--- see how dense behaves even if sparse isn't good
....

- filtering after probe3d removes most of the added matches
	- is the high error related to the optimal points not all aligning inside allowed error ?
	- ...

	=> print out the new / 3+ matches to screen to see ERROR ?


- surface triangulation is poor
	- soften noise
		=> better finding neighborhood size
	- curvature estimates poor - triangles are too tiny
		=> do more averaging/blurring on surface estimation

- add surface process in app



TEXTURING:
- need additional step for fine triangle-texture point localization
	- graduated loading

- scene copying triangles.yaml pertinent info



....



~ cleaning up 3+ matches points by dropping worst NCC point2D
	- no clear divisions ... maybe plot some ?

- 3-way match points try trifocal tensor improvement ?

- is probe3d picking optimum location from haystack??

- when matches are updated -> pick best point as reference & update other points to be best matching?







- how to incorporate different image SIZES / scales
	=> everything in terms of error in image A and image B / NORMALIZED 1:1 error / cell size



	=> how to include/exclude:
		- get all view pairs from world
		- get match count for each pair & add to list
		- get max / sigma for entire list

		- for each pair:
			A) if it passes check (has enough matches)
				if EXISTS ALREADY
					do nothing
				else
					make a NULL entry
			B) else:
				IF EXISTS:
					remove
- ...


B) walk thru each pair to see progress
- need to decide GOOD & BAD PAIRS to include

- dense points should be
	for BA: - don't AVERAGE patches -- use sphere approx ...

C) pipeline
C) make sure enough points for tesselation (subdivide cell size ?)
D) get to final point cloud []




- probe2D algorithm isn't set up for 2+ views



=> most efficient way to add track points
 	in reality will be non-iterative, so should be only loaded once

=> what should cell size be in ALL CASES?
	- track combining doesn't matter -- doesn't do any propagating

=> MANY BAD SEED MATCHES
- need to allow for noise (NCC SCORE)
- need to

searchPoints2DBestMatch
bestAffine2DFromLocation
-> what to do with points that are far away from optimum location?
	=> willing to drop like 75% ?
- really bad seed points
---- should try to filter out pairwise poor matches beforehand?:
- optimal location -- need better affine matrix



- with few seed points => need to do hierarchical point searching [use best corner score location instead of center?]
	2 or 3 steps of accuracy:
	=> 1.00% (11) [21]
	=> 0.50% (5)  [11]
	=> 0.25% (3)  [5]   ?


- 3D points are still very fuzzy
	- try larger images?
	- need to have a lot of good tracks

=> zoom in on a problematic /noise point & figure out what precisely is bad?
	- match points in 2D just off slightly?
	-


=> RECHECK WHAT OPTIMUM LOCATION MEANS
	X-BAR
	=> not using exact points, but optimum projected points
var error = R3D.fError(FFwd, FRev, pA, pB);
var error = R3D.reprojectionError(estimated3D, pA,pB, extrinsicA, extrinsicB, Ka, Kb);
var location3D = R3D.triangulatePointDLT(pA,pB, cameraA,cameraB, KaInv, KbInv);
triangulatePointDLT



- plane sweep ? -> depth / view fusion
- line sweep ?


- depth uncertainty from pixel-projected voxels ?
	-> how to use ?
	-> combining track point estimates into single point ?
=>



- get very simple: 6 image object scene
	- lots of texture
	- not reflective
	- not transparent
	- not too complicated geometry
	- close image takings
	- want full 3D scene for later usage
- get point cloud
- get tesselation
-

- try larger image
- now with lower SAD/NCC criteria: try to optimize affine before filtering input points to give best chance to keep [will also need to validate affine in case its garbage]
- points with best location far away from initial locaiton are probably bad ?

- use 'approximate' patches for the very dense datasets





- pockets of bad matches (high R error) prevent total error from going down
	-> have high error
	-> can be removed in global error reduction BUT that also removes a lot of OK points too
-> how to target patches of bad R-error:
	- pick 'seeds' as worst p3d errors
	- select neighboring points while error is HIGH ENOUGH
	- drop as a group



- cone-sphere-intersection for sphere-filtering working

- still don't have dropping of bad affine matrices after optimal-transform checked

- is filterSphere3D working?
	=> removing all chunks of intersecting sphere-patches?

- is local3D dropping working? - (high variation in local 3D distances)
 	=> removing isolated noisy points

- local2D dropping? (high difference in F, R, M)
	=> removing

- searchPoints2DBestMatch
	=> really high error initially ? lots of bad/non-unique points?





- would stages of cell-size help? 11 - 5 - 3 ?
	A) get error down
	B) expand cells
	C) reduce cell size
	D) goto (B)


- repeated drop extrema points -- for when there are several really bad points pushing off stats

- isolated chunks of bad matches that need to be eaten away at?
	=> - HOW

		- patches would help


- add drop distance points -- where average camera distance >> population



- drop voting 2D based on:
	- difference in affine transforms
	- F
	- R
	- NCC
	- 3D location / distances
	...

- why are initial matches dropped - from: 8662 -> 7173 ?



- BA point locations to update cameras?

- simpler patch initting / rougher

- eventually keep track of which cells were already attempted and failed ()


- convert from affine MATRIX to MATRIX2D & reuse

- affine matrix estimation is very wrong in some places ?



- should the pairwise do anything to help: [currently only optimize R] -- YES: only best of best & worst of worst
	- remove bad points
		3+ sigma R & F only
		2d voting of:
		 	- bad 3D location
			- locally high SAD scores
	- add good points
		1- sigma only
			-> 2D search neighbors
	- use patches ?







- affine corner does not scale with image -- only with local area ->
- extract / visualize oval at scale

x USE CORNER BLOBNESS ... need to undo log tho

- quick way to remove points that are very similar

- if only so little can be matched:
	- add step between feature matching & dense?
	 	- get 2x~10x more corners, but restrict search to F line +/- Ferror
		- use general size scalings from first step to get 'features' at relative scalings


... need to look at blobs ?
	- areas divoid of features ... minimum of corners
	-

- WHAT TO USE FOR PRIMARY DIRECTION CHOICE ?
	- different scales -> most dominant ?

- COM from center @ zoom?
- gradient direction @ zoom ?
- gradient binning @ zoom ?



- move toward COM ?
- move toward PEAK?

- eXPERIMENT WIHT ABS(x-u)
- experiment with skewness, kurtosis, ...






- after finding initial corners, move to nearest peak gradient

- other moment-like measurements



- score goes up, then shoots down ...



- if over 0.99 => done
- show all stable affine points
- drop affines that are over some maximal skew ratio
	- angle is too close -- skew
	- relative scaling is too akward?


- try using source points that are from maximally-changing locations
	=> fast way to process these?



- try moving point toward location with more equal-covariance ratio ...




----- integrating matching of multiple types of features:
	- corners [~1000]
	- blobs [~200]
	- MSER [~100]



--- sometimes peak view is a featureless blurr ...

--- look back at maximally change in any direction points ?


--- starting point doesn't seem to quite be 'center'/closest of corner?
=> use actual corner sample points to learn about behaviors

- problem:
	- following gradient sometimes results in a LINE ... not predictable


--- what if gradient changes directions ?
--- should sweep in ~?45 degree radius and pick largest gradient position
--- maybe not follow PEAK GRADIENT, but 'CURRENT' GRADIENT


AFFINE FEATURES ...


CORNERS WITH CLEAR CORNERNESS:
A) need a very zoomed in image to find overall gradient of corner
B) need a medium zoomed in image to get angleness of corners
C) need a low zoomed in image for moment estimation OR USE GRADIENT ??? -- what is most stable?
D) need a zoomed out image to get differntiating features

CORNERS THAT ARE MORE OF A DOT:
---- this is more of a blob ... are these picked up?
- gradient at center ~0



..........
- test different image/scene data set

	=> TEST ALGORITHMS SEPARATELY:

		- originating SIFT objects are not matching well
			-> branches have lots of noise
			-> medium change in perspective hides lots of matcheable areas
			-> not a lot of overlapping features to allow correct match opportunities
				-> try to get more initial points
					-> more initial points requires better approx of UNIQUE features to limit n^2 matching
		=> VISUALIZE ALL STEPS OF ALG IN NEW DOC

				=> better scaling/blurring : not just interpolation but pre/post blur for scaling
				=> larger blurring to get 'bigger' features and ignore noise
				=> better angle selection accuracy [try only centermost ?]
					- vizualize moments / COM
				=> better windowing / check: center more important than edges

	=> downstream results are trash

DECISIONS:

- how to LIMIT features

- how big the corner feature should be around point for MOMENT
- how much blurring should go on for MOMENT (ANGLE) extraction
- how big the corner feature should be around point for SIFT
- how much blurring should go on for SIFT extraction
- how to window SIFT importance [gaussian] tapering
- how to determine ASYMM angles/directions


R3D.calculateScaleCornerFeatures(imageMatrixA, maxCount);

R3D.generateSIFTObjects

R3D.compareSIFTSADVector

R3D.matchObjectsSubset





- initial affine matrix approx needs some taming
- 2D pairing needs to attempt propagating







- SEVERAL METRIC NEED TO CONSIDER FOR PROGRESS:
	- reprojection error - MATCH
	- reprojection error - ABS
	- PATCH COVERING
	- F?
	- R?

- uniform sampling inside sphere

- final BA still has high error & sporadic points

- nonlinear 3d point locations
 	- each MATCH would also need one ????

- increase samples - upsample [for tesselation]
	- TRIANGLES IN 2D [smallest] - delauny triangulation ?
	- hot spot - each pixel = minimum distance to nearest neighbor
	- ...



---- another step to re-sample pairs & get dense points from



- surface tesselation:
	- need dynamic local size count
		- some minimum number of point to start with (>>3)
			- & some max ...
		- some 'graph' to estimate when 'peak'/optimal sample size is achieved
=> instead of getting EVERY POINT to calculate, use some sampling count, eg inside a radius



- lots of DROP SCALE RATIO: AFTER previously validated ... why?
- propagating points doesn't seem to add much / they are pruned quickly
- divide R error by the number of points in track to allow for some sympathy for multi-connected components




- initial points locations are very separate
	- is this somewhat expected?




- if a point has a poor reprojection error, see what the 'better' match location would yield in a change of position in 2d





- check single-view logic for:
  .... gd_BACameraExtrinsic





DENSE POINT BA:
	- update views
	- update patches
	- update points
- upsampling ?

=> OUTPUT TO file

TESSELATION LOGISTICS:
- load final dense point set
- up-sample points?
- iterative surface front-propagation
- save to triangle file
...


- TRIANGULATION:
	- load ALL P3D from file
	- triangulate surface
	- save to triangle file



- view/match/triplet/epipolar - graph  consistency:
	- a separate pseudo-reconstruction can take place before final reconstruction (sequential/iterative)
		- reveal/prune bad pairs/triplets
		- possibly relative not need absolute locations
		- start at most reliable edges and work out from there




PLANAR STRUCTURE:
	=> 4 point algorithm for when all 3D points are found to be on a plane only
		- planar epipolar constraints


- adding point-camera edges in view graph processing ?
	- pick some subset of points to keep processing low


- dense initialization of points
	[1.5 rad pixel distances between p2d - to limit NOT EVERY PIXEL - 3x3 neighborhood]
	[patches ~ nearest patch averaging 2d neighbors & 3d distances]

- iterative 3-way dense BA to eliminate spurious points

+++++++++++++


- optimizing on dense data (to get ready for tessellation)
	- need patches for discarding some spurious points ?
	- can't use the patches on dense data (takes too long to init)






- view-view covariance matrix means WHAT?
	Covariance Matrix:
	Correlation Matrix: ...
		- problem with covariance matrix is sigmas/values need to be in some ABSOLUTE scale to compare
		-

- filter to 3x3 grid so processing is manageable
- import from filtered-dense file



- how to use TFT in stereopsis
	- figure out a TFT for every 3 views: A, B, C
		- include only subset of points that already have 3-way-matches
		- estimate TFT linearly (up to 100-1000 lowest-F/P-error scores)
		- shoe-horn in other possibly good 3-way matches ?
		x calculate relative PA-PB-PC

- determine if a tri-image set is good?:
	- A-B & A-C & B-C matches are all above some minimum count / error

- initializing trifocal:
	- 3 point spaces: for each view
		- drop points that are too close to existing point (<1px) [order on corner score / etc on insertion]
	- search radius ~ 2*Ferror [of Fab or Fac]
		for each seed point:
			- each point has list of potential matches for each other view
				- point
				- rotation [from F]
				- scale [init from affine / refine from NCC]
				- score (NCC / SIFT)

- get optimizing working for multi-view
	refineCameraAbsoluteOrientation

is the translation averaging: tij = Tj - Rij*Ti ? or are just the Ts involved ?

- get back to surface tessellation (once points are stable at surface)

- get back to texturing


- USE TRACK POINTS [100~1000 per pair] to initialize global solution [Pi]
	- BA step to reduce global errors [no images needed]
	- propagation step to [yes images]
		- loop:
			- load view groups [3-5] most likely to result in more overlap
			- propagate 2D-3D to fill out open areas/gaps
			- try init new points
				- [3D] using corners in open areas
				- 2D: TFT
	- drop outliers out [no images needed]



- USE OPTIMIZED VIEW GRAPH to break the problem up where possible
	- prefer lower error pairs
	- prune repetitive views
	- ...


- TEXTURING:
	- load triangles
	- optimize viewing angles
	- mark which triangles/vertexes are needed for each view
	- load view one-by-one
		- load texture_i & add alpha
		- all pixels start at: 0x0
		- pixel i = alpha*A + beta*B + gamma*C : A + B + C = 1.0 | values will be quantized to nearest [0-255] if using a PNG to store ...


- WHEN A NEW VIEW IS ADDED:
	- for each pair (~10)
		- PAIR F
		- PAIR P
		- TRI = relative SIZES
	- if change is MINOR: [near a lot of existing matches, 'surrounded' (initial location estimate is reliable)]
		- inject into existing solution with best estimate
	- else
		- TRACK ADDITIONS ?
		- TRACK UPDATES ?
		- INIT SKELETON GRAPH ONLY WHERE EDGES CONNECT ?
	- UPDATE DENSE LOCAL-GLOBAL SOLVE




- reprojection error:
	A) estimate 3D points (reprojective)
		Points3D_est=triangulation3D(ProjM,Corresp);
		project 3d point to 2D image planes
		error = sqrt( distanceA + dB + dC )



		- add repeat-till-convergence (error doesn't change) using direct edges for each vertex ON scale/translate/rotate optimum strategy


		- TRIPLE PAIRWISE RESULTS IS MORE LIKELY MORE ACCURATE THAN PAIR RESULTS:
			- WANT TO USE THESE RELATIVE PAIRS IN INITAL GLOBAL LOCATION?
				- how would scaling work then?



		- adjust differences in image lighting to match each other [move A toward B and B toward A OR just match]
			- color space
		- ADAPTIVE COLOR COMPENSATION - color balance [gray balance, neutral balance, white balance]
			- global adj of color intensities (RGB)
				- neutral colors correctly rendered
			=> 3D mapping:
				- each 3D->2D point set gives list of colors to be matched
				- different regions can be mapped differently




- will eventually need outlier detection in large scene/view graphs

	- inconsistent location/orientations - alternate path tests
	- rotational consistency
		- if error is much more than calculated ()
		- voting?
		- spanning tree inliers
	- loop statistics
	- baysian inference



- have not yet applied nonlinear triangulation (choose X to minimize x_i and x_j reprojection)
	- 6 degree polynomial solution


	- need to figure out how to get relative scale between different stereo pairs
		- combine multiple stereo camera matrix
		- relative scale camera matrix
		- multi view geometry unknown scale

	- get an initial estimate of camera PAIR relative 'world' scales

	- SEQUENTIAL METHOD: start with best pair, and gradually add views as parameters are more-well-defined (error minimized)

	- FACTORIZATION ?

	- TRIFOCAL TENSOR?

	- sample-point scalings:
		- random pairwise matches in 2D
			- limit to top corner match points
			- satisfy NCC @ each end?
			- get 3D distance [use error of each 3D point as weight]
		- plot distribution ; pick mean size w/ sigma error

	- multiple F1-F2-F3 to find 3-way matchings?

	=> only need an initial approximate scale [~1% error ] to get initial location estimates correct


notes:
projection / extrinsic camera matrix:
P = K[R, -RC]

) estimating R / F error should use sample subset to limit processing

) How to get rid of very isolated points?
	- each point track it's neighborhood distance
	- vote


----- add a step at end of median to improve points by getting a ZOOMED OUT affine, then ZOOMED IN affine (1/20 ~ 21) (1/100 ~ 11)
- take a while ... 1E4 * dozens



(test optimizing each point pair by another corner-point refinement (should do as part of MEDIUM, but can test in STEREO)



5) test fluid-movement point2D
	- see if R-error is useful for repositioning point (and if 3D destination point is good)



- only keep best NCC/corner per cell (3x3-11x11) ?
	- reduce processing











=> for 2 cameras .. might be hard to differentiate
	=> availability of alternative points ?
		- might be possible that this is not the case
	=>

=> for 3+ cameras:
	projecting from a correct 3D point will result in more matches for a point
	projecting from a wrong 3D point will limit that point to only 2 matches
	=> number of matches a point2D().point3D.matches.length) has can weight against correct/incorrect when voting

=>

SPORADICALLY BAD POINTS (ERROR) - can be voted out fairly unanumously
- small groups can be iteritively picked at until they are all removed




ANOTHER METHOD TO REDUCE R ERROR:
	- move a point in A/B to reduce reprojection error
		- needs to take into account NCC / distance to limit maximum relocation




- some super low-R-error points, but are obviously wrong in 3D
	- how to identify these?


- relative camera poses is not the same as inverse ....

http://www.cs.cmu.edu/~16385/s17/Slides/11.1_Camera_matrix.pdf


STEPS:
estimate3DErrors
	Stereopsis.ransacTransformF
		F = R3D.fundamentalFromUnnormalized(pointsA,pointsB);
			F = R3D.fundamentalMatrix(pointsA, pointsB) == Linear DLT
			F = R3D.fundamentalMatrixNonlinear(F, pointsA, pointsB); == distance from projected line error
		P = R3D.transformFromFundamental(bestPointsA, bestPointsB, F, Ka,KaInv, Kb,KbInv, null, force, true);
			E =  KbT*F*Ka
		transform.calculateErrorF();
		transform.relativeEstimatePoints3D();
		transform.calculateErrorR();
...
this.estimate3DViews(); // find absolute view locations
this.estimate3DPoints(); // find absolute point locations
	P3D.prototype.calculateAbsoluteLocation
this.estimate3DErrors(true, true);



R3D.inverseCameraMatrix = function(P)
R3D.componentwiseRelativeCameraMatrix = function(transformA,transformB)


R3D.projectPoint3DToCamera2DForward:
	x = K * [P = R|t] * X
	P = EXTRINSIC CAMERA MATRIX [inversISH of camera location matrix?]



var projected2DA = R3D.projectPoint3DToCamera2DForward(estimated3D, transformInverseA, Ka, null, true);
var projected2DB = R3D.projectPoint3DToCamera2DForward(estimated3D, transformInverseB, Kb, null, true);



- can points be 'shifted' in 2D space if they have high error?
	- get a haystack for one of the views and look for better location?
		- rotate slightly / zoom slightly / ...



- when requiring eg 1000 point estimations, maybe use bottom 1/2 of points ordered on lower F error ? (not whole population)

criteria for dropping points has to be improved
- can't use global well, need local solutions
	- 2d grid ...
		=> check logic in prob2d
			=> better corner localizing ?


- back to how pairs are performing
	[does the cell size need to be smaller?]

- back to how initial view orientations are (error)

	=> do simulation and see where approx fails
		-> need a 3D scene model ....



... why is uniqueness dropping so bad ?



SAD/SIFT compare of matches rather than NCC
	- 10x longer


- maybe there are other errors - camera ? radial distortion ?

=> try to get a set of pairs that have very low (<1px) error initially
=> then also need absolute estimate to have very low error



- a lot of initial matches wrong immediately -- in vague areas [from Medium V]
- add step at end of medium match:
 	- that compares elements NCC/SAD
	- ignores low corner scores
	- drop highest F-error points
	- drop points with very high secondary choice (non-unique) -- difference larger than window size









- drop points that are very isolated (not around MEAN locations)?

- maybe point3D 3-way matches not working as expected?
	=> show some 3-way pairs / scores and see what what




- how should patch normal be initialized / optimized?
	- camera normals and camera-center-to-point vectors


- newly added 3-pair points are not being kept: <10% keep ratio ????
	-> linear dropping is too much/fast
=> show some of the items being dropped (& WHY?)
	=> RERROR: [2-12]
		- very far away from existing solutions


- prevent patches from being re-evaluated in probe3d (checked:)



- something that works in F but is very wrong might be able to be obviously removed in R ? very very close or


- add sub-pixel precision in several places along pipeline




=> if there's a bad zooming problem maybe REMOVE
	[if eg size is much larger or smaller than expected based on average camera distance]



- when update patch should be called (if is has a patch but NOT checked update (need a var))
	-- or of view structure has changed enough:
		- R error in any of possible views
		- relative distance to any cameras of possible views >> some ratio (1.5-4)
- if a patch IS CHANGED, it should require RE-APPROXIMATING THE PATCH/ NORMAL


? DENSE F MATCHES - plot pairwise matches for 1 & 2
? extracted probe3d points are flipped?


looks like initial F-Match is quite wrong image 0-2 ...
	- best match fwd / bak maybe needs larger windows
		- maybe drop matches that have minimal cornerness /

possiblyVisibleViews == wrong ?

initialEstimatePatch



for each pair:
	- pick 100 best canidate points to project to other views
		- avg corner score
		- lower R error
	- do projection to each other view and see if match is good enough
		- R / F / M
	-


bundleAdjustViews - BundleAdjustCameraExtrinsic working?


focus combining code on merging points to more force multi-way alignment

-- SEE what dropping worst corner points looks like
	- 'random', or more depth-based?

- drop worst corners from pairwise solution:
	-> drop any corner score worse than bottom ~10% of images

- add back patch-3D projection in group solution
- check 2D expansion algorithm
- outlier rejection algorithm from local 2D affine error
	=> CAN'T USE SIGMA because outliers trap data ... need some kind of sigma-finder


HOW TO OPTIMIZE Fs GLOBALLY RATHER THAN Rs?


IS IT POSSIBLE TO DIRECT ABSOLUTE R IN DIRECTIONS THAT ARE BASED ON RELATIVE R - DERIVED FROM F ?

* IF STILL CORNER MATCH DROPPING = MOVE INTO CENTRAL LOCATION SO PROBED POINTS ARE DISREGARDED IF WANTED TO ADD


=> other BA methods work on optimizing F, not R


NONLINEAR MINIMIZING

- error for edge should be weighted by some ratio of 1/weight


CONVERTING BETWEEN QUATERNION AND TWIST BREAKS STUFF ...
	- AVERAGE QUATERNIONS ? ....
	- ROTOR ?
	- SPECIFICALLY WHY DON'T TWISTS WORK?

ERROR MINIMIZING




initial pair estimate: drop points until under 1 px sigmaA





















- corner features ANGLES are not aligned so well ...
- STUDY WHAT A MOMENT IS
- WHY IS GRADIENT NOT AS GOOD (shouldn't this be good?)
=> could be related to anisotropy (need to asymmetrically scale area?)



- any way to make initial F estimates more consistent?
	- adaptive matching error limits (shitty matching conditions allow for more error)



- HOW TO HANDLE CAMERA IMAGE ROTATIONS?
	-> IMAGE METADATA:
	identify -verbose ~/image.jpg
		Orientation: TopLeft | TopRight | BottomRight | LeftBottom
  		Properties . exif:Orientation: 1 | 6 | 3 | 8





- HOW TO COMBINE POINTS W/ AFFINE MATCH VS DENSE MATCH POINTS
	- closest point?
	- closest N points & average?
	- local:
		- relative angle comes epipolar line directions
		- scale cam be an optimized check (~3 sizes w/ maxima check?)




- allow 'loop' around for scenes with epipole interrior [or some lines wont get matched]
	- (copy) top / bottom explicitly
	- modulo 0 when -1 or +hei



- F MATCHING
	- line but start at best match point for each line and go left & right
	- optimal locations:

		- HOW TO DO CELL BELIEF PROPAGATION
			- there are confident cells & less confident cells
				- confident ones are pinned down
				- non-confident ones can float around
			- 9-neighborhood dist
			- L / M / R neighbor dists
			- keep track of 'confidences / locations' at previous scales
		- how to allow for occluded pixels?
			- pinching in left or right image ?
				- along with poor matching scores

	- vizualize confidence areas
		- different confidence measures

- polar rectification
- polar F-matching
	- offset image by starting line points
	- allow MODULAR SAERCHING FOR WHEN EPIPOLE IS INSIDE




- re-check affine matching --- display features on image for viz
	- try to add affine restoration to points by getting center point and assessing the min/max directions & unscaling
	- moment
	- COM
	- COV
	=> DOES THIS REQUIRE ITERATIVE SEEKING ?

- saving corner affine to yaml / loading from yaml






- stero matching:
	- path costs with vertical / horizontal neighbor costs


- convert from F corner matches to relative size/angle [keep track of epipole angle]
	- get optimal corner scale size ?
		: for each match:
			-

- image rectification re-do [direction matters]

- how to do dense matching wth F
	- rectify
	- map lines together
	-
		- 1D epipolar search
		- brightness constancy
		- uniqueness: 1 to 1 matching

		- monotonic ordering: [not preserved in all scenarios wih large disparity]
			- occlusions
		- smooth depth of field
		- continuity:
		- disparity limits:
		- grouping: structure/connectivity is consistent
	- hierarchy ordering
	- incorporate scale difference from source points



- MEDIUM MATCHING
	- pick out corners & match along F lines
		- high gradient values (corner or edge)
	in: 50-100
	out: 100-1000





- rotate moment by additional cov angle

- check cov and mom sizes




- GET PEAK PROMINANCE IN PCT OF TOTAL > DROP PROMINANCE < 50%





- image compare epipole / line search testing - experiments




x try minimizing error using GRADIENT DESCENT
	- 2nd view's roatation (from starting point) & translation [separate?]



- points behind camera in PAIR:
	R3D.cameraExtrinsicRANSACFromPoints sometimes has a null P ?
		- R3D.transformFromFundamental
		- transformFromFundamental3 wrong in particular scenarios


- point3d from match3d.estimate3d should also be combined based on depth error based on view positioning
	-> frustrum-projected-pixel

- after orientation is established and outliers are reduced=> [after pair-wise or after global merge]
	- should try to expore high-cornerness areas


- plane seems to take over & not propagate to other areas
	=> possibly from RANSAC only grabbing the planar points as max fitting
- allow cell propagating always?
	- TEST

- faster failing on 3D steropsis : if R error is really high with lots of matches => fail
	matches: cellCount [width * height] * 25%
	R error: > 10.0
	F error: > 5.0


- pairs of cameras with transforms > 90 degrees are invalid


try to speed up: transformFromFundamental2 -- used a lot



* really bad matches need low cellsize to allow good groups to grow and push out the poor group
* bad matches exceed good matches & takeover F-RANSACing [9OC9F69F & H1DXVCYR = 94SG6X20]
	- local iteration minima?
	- too much of a skew
	- too much of a scale
* really poor R pairs can be used to estimate relative locations but MATCHES should not be used


- IGNORE PROCESS FOR MATCHES OVER CERTAIN PIXEL ERROR | MATCH COUNT





IMPEMENT: corner - scales

- unstable corner angles ?

- try using corner points and assigning them the scale of the closest sift circle

---- TYPES OF MATCHES:
	- corners
		- corners (point) ; SIFT OR gradient => (angle) ; assume => (size)
	- corners w/ geometry
	- SIFT blobs
	- MSER
	- MSER+corners
NEED:
	- POSITION
	- ROTATION
	- SCALE


- sift points still suck


convert to objects: DENORMALIZED:
- object:
	center: V2D
	angle: number
	size: pixels




- get basic triangles processed
	~ filter out odd-shaped ones
	- set patch normals to just be averge of views of 2D points
	- output to file


- smoothing on the projection

- optimizing plane via minimizing energy fxn

- voronoi point upsampling


- bilateral filtering for smoothing

=> curvature of area shouldn't be more than the minimum neighbor distance


- smooth points out before triangulating ?
	- groups items into clusters
	=> push away from a location rather than pull towards?
		- initialize all deltas = 0
		- for all points:
			- find all neighbors on a local plane
			- push the neighbors away on the plane based on distance falloff & first-neighbor-distance

- spherical projection ...



- with a lot of noise, need larger sample size (~10 => ~25) so the planes are more gradual and not crazy projecting
	- also curvature is assumed too small with all the wild flailing


* why is APSS curvature wrong?
* why can't plane sampling size be small (or why is sparse sampled areas poor)
	- show local projected plane @ area
* how to find optimal sampling size for area? -- read paper




MLS surface projection -- bad at ears / low sample areas
	- how to get


- stereopsis patch normals are clearly wrong
	- try homography instead of affine
	- larger patch size
	-


- consistent normals (single-sided) propagation using MLS



- VERIFY minimum edge size reasoning & search radius



- MLS surface projection
	- variable sample size
		- 'scale larger than noise level'
		- figure out best nearest-neighbors to use
	- PLANE:
		- minimize energy fxn: Sum_i:  (dot(normal,pi) - dot(normal,POINT))^2 * THETA(||pi-q||)
		- THETA = smooth, radial monotone decreasing fxn, positive in whole space
			- theta(d) = exp(-d^2/h^2) ; h = variance





- App: import 'model' file
- App: import all required assets & start TexVieBln





- what is an adaptive sampling count mean - around areas of different sampling densities / error rates
	 - not a constant neighbor count
	 - not a constant distance
		 - start with minimum amount [5-7]
		 - increase radius until containing ellipsoid sigma0 & sigma1 are 2x as big as sigma3 [ensure some amount of planarness]

	- pre-op on data to find best K sampling for each point
		- start at (random?) point
		- determine K linearly from ~5 to ~100
			- set K
			- recursive op on neighbors, using self as reference
		- [repeat for other 'seed' points]



- search radius | curvature | ideal-lengths --- something is wrong & smoothness between triangles nonexistant




- HOW TO OPTIMIZE VERTEX POSITION IF IMAGE NOT IN MEMORY
	- try to group vertexes by scene regions
		=> optimize


=> image matrix cache to hold most last used ~10 / 32MB



- if projected location is much different than projected size (eg 2.0), then mark as dead end


EDGES:
	-> if small triangles are used => lots of holes
	-> if large triangles are used => loose detail




- surface illumination-invariant (un-shaded) coloring processing of images
	- Lambertian surface
	- BRDF




=> if any perimeter-neighbor's normals are > theta (45~90 degrees)?
	=> smooth?


- if an edge-triangle intersection is not solvable -> set as boundary
	- to stop?


- 3D oct-tree objects within distance of circular plane & triangular plane






- PROJECT TO SURFACE:
	- closes sphere points
	- poisson gradient
		- bisector to minima [double gradient]
		- normal calculation from rolling sphere/circle
		- normal averaging (to smooth out normals for gradient descent)
	-

- sphere iteritive:
	- if less than radius: move toward closest sphere point
	- if beyond radius: toward point [points very far from surface]
		- if between radius & 2r: ignore ?
		- if beyond 2r: toward point


- patches don't need to be updated if the cameras/matches have not changed much
	- keep track of:
		: normal-to-view-angle average
		: average distance

- still some noisy points at end:
	- depth discontinuity checks?
	- need to remove spradic groupings


- color derivative @ directions SIFT vector
	- 9x9 grid
	- average color
	- 8 * R/G/B differential



- some parts of image aren't getting expanded on (wall, couch side, floor areas)
	-> probe2D = prelimited based on F/R scores
		-> allowing them to pass anyway brings more error to the scene

=----- some probing restriction is stopping

	- as points are dropped, does the probing2d get to keep track of searching?

	- SAD/NCC ?
	- affine transforms?
	- zooming out to 'best' cornerness size? - this does have an affect

- good with points seen by all cameras, but not if only visible in few ... ?
	- when a probe3D is projected onto another view, the point it covers might be a good projectino, but the object might be obscured
	-


-  point 2D merging
	- need to evaluate how good the additions are before they are combined
	- need to pick optimal locations
		- most cornerness point?
		- best NCC point?

image where each pixel shows distance to nearest corner with value >= threshold
	- for i = 0 to distnace amount:
		- record max-min & index








=> double surface points at end by interpolating in IMAGE grid where there are empty cells (at half size)
	- fixed grid
	-

=> ICON
	- optimal criteria:
		- original
		- gives some idea of what app does [but still abstract / not too specific]
		- obscure physics/math/science root
		- non-text
		- simple - solid coloring
		- cool
		- double meaning




- how to find 'lowest' increase of gradient? &&&&&& THE VALUE
	- get scores
	- turn each score into: 1/max(diff,eps)
	- get gradient
	- HOW TO GET THE VALUE THERE ? => 2D surface ?
- get uniqueness = lowest gradient per unit cell (@ 1/2 cell distance away)


- does the new resolution increasing iteration work OK at same resolution?
	 - may need new FXN that inserts a P3D as-is w no merging-conflict checking
	 	createP3DWithPointsAndMatches(V3D, [V2D], [affine])

~ final drop all 3D points with errors below 2*midpoint globally


- compare stereopsis affine transform with match affine transform
	=> use whichever has better score ?


SINGLE PIXEL UNIQUENESS VS MAXIMUM IN AREA UNIQUENESS


- add back validation
- need to restrict propagation of points into smooth areas
	>< range
	~ uniqueness
	- cornerness


- use uniqueness | cornerness when adding new match to limit matching more points in bland areas

































- graph combining error to final stable system
	-> markov states?
	-> GRAPH BASED SLAM

- tracked features across multiple
	- determine closest cameras (range of view / overlap)

- choose best cornerness point when picking probing points

- 'representative' graphs for reducing optimization of 'finer' positions till later
	- combine 'redundant' views

- should optimization happen using E points and not F points?

- speed up searching
	-> add pairs
		-> P3D.connect
	-> get added list for view i + j
		-> if item still has a point2D w/ point3D @ view j
			-> add neighbors to search queue
	-> search neighbors

- do final BUNDLE ADJUST

- RANSAC PLOT LIKLIHOOD OF GETTING A NEW MATCH (log ) and quit if very non likely (wasted iterations)

- use output of lowe-res solution (matches & Ps) as input to nex (x2) higher resolution

-> much of the effort goes into removing outliers and troublesome data before the bundle adjustments can find local minima (very good initialization)
	-> find average of rotations
	-> find translations
	-> BA


-> SYNTHETIC DATA FIND OUT WHY NONLINEAR SOPT SUCKS ...
	- can 3D error visualization work?
-> P RANSACing

- why is nonlinear optimizing failing?
	- investigate the 2 erroring camera views? []
	- analyze reprojection error measurements & why squared / linear error would be better or worse in given situation
		- bad points throwing off?
		- infinity reprojection is better?
	- add RANSAC somewhere and only use best inliers?
	- try LM instead of GD


- bundle adjustment : nonlinear camera reprojection error minimizing => pushes points/camera toward infinity
	- optimize single camera R|t against all other view-pairs
	- TRACKS
	- Levenberg-Marquardt
	- separate rotation & translation optimizing
	- optimize using normalized image coordinates (F->E)
	- BUNDLER: https://github.com/snavely/bundler_sfm
	- S. 7.3-7.5
	-






- keep track of changing cells for each view:
	- workingCellSets:
		- views:
			- 1
				- [{i,j}, ...]
	- update working set on add/remove point / match
	- need some 'previous attempted' metric (reprojection error?) to dis/allow retrying match


- nonlinear view camera optimizing:
	- set absolute camera positions on iteration ~ 3
	- camera-only BA one at a time for 10~100 iterations
	-> see if error goes down




>>> SKETCH
	- what simultaneous-optimality of 3D pose looks like visually
	-














- prefilter image with high edging / contrast / ...

- do a bundle adjustment step at end of 3-5 iterations

----- IS THE POINT COMBINING AT DIFFERENT VIEWS REALLY CORRECT>
- WHY IS THE CAMERA MATRIX INVERTED FOR DISPLAY ? [is maybe the z direction reversed or something?]


- when r error / point3d count is above some threshold, do incremental iteritive nonlinear changes [on absolute transform?]


- some iteritive loop method to change each point?
=> start to only use absolute values: P3D & Ps



- why are 3+ cams location bad ?
	- R gets pretty low for each
	=> but combined locations are still VERY off
-> some logic behind combining is wrong?


- remove orientation checking helps?

- patch check again


--- need way to force different views to align eachother

- 3D projection of low-error points (3D abs location) onto un-searched view


- patch refinement:
	- reconcile 3D location with projected location with 2D location
	- set point3D8 to be closest point of projected rays thru 2D points ?
		=> is it already the midpoint ?


- filter based on neighbor patch normals

- multiple-views


- 2D translations = affine approx from homography
	=> make into function



- back to surface via advancing-front propagating



> how to keep track/optimize of all:
	- 2D match points: x,y
	- 2D affine transform between image matches: X,Y
	- 3D patch plane: center, normal, A,B,C,D
	-> initialize patch
		- normal:
			- project patches, find 4/5 projected median points, approximate plane, approximate square
			- average of inverted camera normals
		- center:
			- closest projected line intersection
	-> optimize:
		- normal unit vector (pitch, yaw)
		- center point (X,Y,Z) [restricted along path to a reference camera to match point]
		-



> how to transfer 2D orientation between 3D cameras
	- get UP & RT unit vector for camera A & B
	- do projection of upA onto upB & rtB
	- do projection of rtA onto upB & rtB
	- get angles between projected up & rt vs upB & rtB => average

> how to estimate normal (or projection?) from affine matrix


- voting metrics
- score dropping
- affine & translation scoring reassess




- READ PAPER ON R - MODELING
-> ALGORITHM FOR THIS





- prioritize 'better' affine over possibly already existing 'worse' affine
	- based on?

- allow bad affine to happen, then pluck them off ?

=> an existing match might be the cause of a newly-created match
	=> which one to drop ?
	=> keep track of cause
- count those who agree / disagree ?
	=> pick based on votes ?




- VISUALIZE A CELL TO FIND OUT WHY BAD
- lots of overlapping should not be allowed
=> DROP BASED ON SOME CLOSENESS locallly


- and cells w/ affine matrices much worse than parents => drop
- any cells with opposite-sides predictions => drop




- plot metrics, try to learn:
	- sad
	- ncc
	- Ferror
	- relativeSAD
	- relativeNCC
	- pathScore
- find out why eg chair corner looks so bad & try to pre/post filter it out




- want to prevent bad matches so that don't have to recover from them





- predictive steps JUMP OVER? the correct matching location?
	- during expansion, match should also include initial translational costs [relax term] along side SAD/NCC costs for better optimal starting prediction
	- other routes having predictions would be good too ?
	- incorporate path cost? / lowest relative path cost
		=> look at path costs for the top n matches ?
- ability to 'override' matches with better one when found


- first cell propagating shouldn't be the only decider in what the best location is
- as cells are added, they should consider alternate locations
	->





if a new affine match has no conflicts => can set

if an affine match has conflicts
	=> for each conflicting match:
		if affine is better than all conflicting????
			- lower delta-predicted errors
	=> remove all conflicting neighbors




>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
- seed matches pick best match based solely on NCC/SAD score

when a match is set:
	- for each 4 neighbor:
		- estimate best next location:
			- @ predicted center
			- total error = a*score + b*distance from center  [* distance error is radius @ center w/ linear dropoff]
			- pick location w/ lowest total error
		- ??? get flat path cost?
	- for each 4 neighbor:
		- if no match currently exists:
			- if a previous match exists (neighbor was dropped)
				if new match is much better
					- set match
			- else no prev match exists
				- set match
		- else if new match is much better
			- ncc_new / ncc_old && sad_new / sad_old
			- relativeNCC_new/relativeNCC_old < ~0.95
			- set match

moving of a cell:
* based on origin cell?
	- estimate what new match would be
		- if match is much better than previous error:
			- update match with new one

match:
	- original location
	- original score
	- origial origin cell
	- current NCC score
	- current distance score?

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



STEREOPSIS:
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
initial matching:
	Harris and Difference-of-Gaussians


match:


REPEAT:

	expand:
		- spread matches to nearby pixels

	filter:
		- visibility constraints
			- drop bad matches
		- 3D:
			- drop points outside surface -> |T(p)| is small & N(p)?
			- drop points inside surface -> revomputed depth maps result in |T(p)| is small
		- regularization: n-adjacent neighbor cells is below some threshold [threshold is lowered as algorithm progresses]

PATCH (p)
	- center c(p)
	- normal n(p) [toward camera]
	- reference image R(p) [image that is most parallel to retinal plane]
	- should_images S(p) [images patch should be visible - not expected to be occluded by any other patch]
	- truly_images T(p) [images where patch is truely found - must be at least gamma (2 or 3 in size)]

IMAGE I
	- cells C(i,j) [beta1xbeta1]
	- Qt patch list if I is in T(p)
	- Qf patch list if I is in S(p)\T(p) [in S(p) but not in T(p)]
	- depth of center patch [from image-camera]

estimating position:
	- initial guess for c(p): triangulated from putative matches
	- initial guess for n(p): direction of point to O of reference image

	NCC = N(p,I,J) for patch in image I and J
	maximize:  1/(|T(p)| - 1) * SUM(I in T(p), I!=R(p)) N(p,R(p),I)
		* depth for (reference) (or each? view)
		* normal pitch & yaw (?wrt reference)

initial guess for visibility is if NCC is above some threshold
S(p) => later estimate by thresholding is if depth_I(p,i,j) < depth_J(p,i,j) + rho [rho is deth of c(p) at beta displacement in R(p)]
T(p) => NCC is above some value


n-adjacent = |(c(p) - c(p')) * n(p)| + |(c(p) - c(p')) * n(p)'| < 2*rho 	[centers are close & normals are close to parallel] c-c' should be ~ orthogonal to n' and n

retinal plane
uxu = 5x5 or 7x7


++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
input:
	- images
	- sparse, putative, initial feature matches across images [pairings] (f_i, f_j)
		- scale & rotation

expand
	- look at unmatched adjacent cells
		-

filter
	- global:
		- NCC * SAD error
		- R error [distance from reprojected point]
		- F error [distance from epipolar line]
		- 3D kNN avg distance @ 3,5,7,9,... [isolated points are unlikely to be good estmiates]
	- local 2D: [cell voting]
		- difference in rotation angle [0,pi]
		- max(eigenvalue)/min(eigenvalue) [1,inf]
		- NCC
		- SAD
		- to-neighbor NCC
	- local 3D: [grouping voting]
		-
	- visibility?
		- [depths not consistent]?
		- [normals not consistent]?


CELL:
	- non actual ?

P3D:
	-X,Y,Z
	-NORMAL
	-P2Ds[]

P2D:
	-x,y
	-matches[]

MATCH:
	-P3D
	-P2DA
	-P2DB
	-

- P3D patch normal will have to be re-estimated as cameras change locations

propagation:
	- need to keep track of failed attempted locations so that propagation doesn't continue there [for another given image]
	- square cells?
regularization
	- need to allow lowly constrained matches (non-corners) to move a bit as their localization is fuzzy => NON PERMANENT


normals will have to be re-estimated as camera positions are refined












output:
	- dense image sets [2+ connected image points]
		- normal3D
		- point3D
		- points2D
			- x,y
		- affine between each image


>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>







- propagation step should also include affine checking
	=> limit over-reaching to poorer place



- letting dropped locations/cells back in the game?

- affine/translation cells are very bad



- gradient descent not finding minimum & not stopping
	- needs next destination to be better (not worse), or don't do at all?
	- should affine matrix be updated on pointB update?

- reassess affine & translation errors


- multiply vs add geo + ncc errors


- affine error doesn't seem to be critical enough
	- do affine matrices have too much leeway ?

- does the affine matrix need to be adjusted as the cell moves ?
- some logic to stop cells from being closer to eachother than the affine matrices would suggest







-> review flow field to analyze relazation steps


=> relaxation | data => local optimize

- error outside cell zone is infinite

criteria for dropping bad cell:
- best SAD/SSD score is much less than minimum score [self]
- error in geo is much worse than neighbors [voting]
-


++++++ ALG .... ++++++++++++++++++++++++++++++++++++++++++++++++++++++


for each seed:
	get NCC in area, place at optimal (forward) matching point
	add seed to Q


L = Q
Q = {}





L = Q
Q = {}
for each cell in L
	get local (3x3) NCC scores
	get local (3x3) forward & backwards edge (GEO) scores for all existing (4/8) neighbors
	calculate error scores for based on: c1 * NCC^e1  + c2 * GEO^e2
	calculate sobel gradient: (3x3) or pre-smoothed gradient

for each cell in L
	move cell in direction of -gradient [only up to 1 pixel?]
	if gradient > epsilon (~0.1) pixels
		add cell to Q (need to keep adjusting)
	if gradient > minimum (0.5~1.0) pixels || [if estimated to be very close]
		add 4/8 neighbors to Q (need to propagate changes)

for each cell in L
	update metrics from matched neighbors

for each cell in L
	update vote estimations for neighbors
	if bad cell
		remove match
		remove from Q


for each cell in L
	for each 4/8-neighbor:
		if neighbor doesn't have a match
			if have prior neighbor preduction, use this
			else predict best matching location for neighbor & store
			if prediction is much better than neighbor's initial / final score
				set neighbor match
				add neighbor to Q (need to validate/adjust)









.......

order L on highest error first
get local (3x3) forward edge (GEO) scores [backwards are opposite of neighbor's cell]



calculate pixel movement based on

^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
































bayesean optimization non convex






- how to do progressively better cell sizing

=> sub cell algorithm

--- very small cells have no cornerness & can't be localized & fail fwd-bak test
=> NEED SOME KIND OF GUIDANCE
- if it doesn't have enough variability it can't continue




minimization w/ criteria:
- each cell has a 'list' of possible locations + scores [or no location if no scores are good enough]
- each cell has a 'score' based on how 'smooth' the local topology/geomotry is

- match step: find top best location matches in area [SAD/NCC scores that pass minimum & fwd-bak constraint]
- relax step: move cells locally to minimize cost:
	COST: scoreNCC * A + scoreSAD * B + geometry * C
- geometry has something to do with local angles / distances -> offset from what would be the 'ideal' position

=> idea:
	NCC gradient for corners would be high in
	NCC gradient for edges would be high in single direction
	NCC gradient for non-unique would be low everywhere

gradient for connected components would be high for non-uniform areas
	- error cost = distance between expected location/orientation vs current location/orientation

unconnected components have no (edge) cost

-> if cell position goes past available score location => rematch at new location



-> FWD/BAK relaxed doesn't need 'best' score in same cell, just a 'good enough' score to be in same cell





- move cells toward lower-scored points
- only keep track of cells with high/changing gradients






=> hierarchical
- when EVERYTHING or LOCAL areas have become stable => divide cell at mid-point of edges




- zooming out until uniqueness is good enough / satisfy fwd-bak uniqueness

- fwd-bak validation is strict ...
	- try just 'in the right cell' limiting


- F dropping oscillating problem => how to determine if 'done' => terminal case



- precondition / pre-pare image
	- edgeness
	- histogram expand
	- ... ?

- if F-B location fails - try using different matching scheme ? SAD / SSD / NCC / .. ?




- test with 3/5/7 ... cell sizes


- is gradient more discriminatory / better at comparing?

- alg speedup?
	- save calc?

x display distance metric - not real depth?
- or rotation/flow metric



Affine Dense Matching method (AM)
Normal Aided Matching (NAM)

- how should hierarchy be done?
	- just seeds ?
- try different pixel sizes (compare size should change too)
	- 21 pixels => 21
	- 11 pixels => 15-11
	- 7 pixels => 11
	- 3 pixels => 7-5
	- 1 pixels => 5

- using surface normals to estimate affine transform / homography
- big changes in normal == edge
-


CONSTRAINTS:
- epipolar (F -> line search)
- brightness (SAD == 0)
- gradient (dImage == 0)
- edge gradient (disparity jumps in 3D should match intensity edges)
- ?disparity limit (disparities along epipolar lines)
- disparity smoothness (local disparity not have abrubt changes)
- correlation score smoothness (NCC locally not abrubt change)
- ordering (pairs along epiolar lines not change order) -------- real 3D scenes can violate this?
- uniquenes (each pixel has 0 or 1 match in opposite image)
- mutual correspondence (?)


current = 21
ceil( (current-1)*0.5 + 1)


(current-1)*0.5 + 1
[81, 41, 21, 11, 7, 3, 1]
~ 80 40 20 10 5 2.5 1

- Accurate, Dense, and Robust Multi-View Stereopsis



PMVS = Patch‐based Multi‐View Stereopsis
https://ags.cs.uni-kl.de/fileadmin/inf_ags/3dcv-ws11-12/3DCV_WS11-12_lec10.pdf





- change voting criteria
- change
- add geometric/topology
	- resolve pinching-ness / match

- uniquness dropping

- do zooming out until 'uniqueness' or variation or range or other is good enough



-


- use gradient

- check keep distance ... keep track of other changing things


- how to prevent/recover from bad estimates when groups meet

- monotonocity

- forward backward validation

x show object flow [image flow | field]

- matrix image extract error

- using affing transform vs prediction for filtering bad points
	=> is this not translation ?


- reduce calculation time by only updating based on only changed elements?


- how do matches work when good seed groups meet up with bad seed groups


- use gradient metrics too -> distance errors
	- gradient-vector differences in R/G/B channels
	- ||R|| + ||G|| + ||B|| = D^2


- prevent re-searching matched cell by remembering last search location
	- keep calculated:
		my: position, affine
		neighbor: position, affine
	- if


X:
- match every cell & get cost
- minimize cost by moving cells to less cost area
- until cost minimizes

- only check for possible match if neighbor doesn't alreay have one / in same area
	- 'already been tried' mark
	- 'previoius attemps' marks
- lattice connections not serious enough

- LOOK AT OPTICAL FLOW SOLUTIONS --- seem very setero based
 - Horn-Schunk
 - Lukas-Kanade


- ONLY UPDATE/CHECK WHEN SELF/NEIGHBORS CHANGE

- add 'pairing' for each cell link/edge

- group affine check against individual affine check

- if cells are removed and an island becoms small (~1) -- remove it

~ match pre-constraints

- when fronts meet: much better from should force worse front to recede

- for cells with obvious division between them [gap], they can STAY, but they shouldn't add new matches

- VOTING
	- cells with poor scores should have less weight --- nonequal voting

- keep record of compared neighbors / mark changed neighbor
	-> to prevent recalculating same stats [on match select]
	-> hasChanged
		- set when neighbors change or ...
		- unset when ?
	-> hasNeighborChanged
- only care if it's an 'edge' or recently an 'edge' ?

- stopping conditions

- pre-filtering matches
	- ordering constraint
- post-fitlerting
	- drop bad matches & mark for not-retrying unless point/transform changes enough



- LABELING
	- set on seed create
	- combine after expand/relax step
	-> if a group is found to have large error compared to other groups -> drop entire group ?


- searching for best matches is off by a lot


- using putative matches
	 - evaluation step
- pick match from choosing set []

-- comparing affine transforms to indicate similar/non-similar
	- X & Y vector distances summed / RMS

- try SAD vector that is more color based and not color derivative based

- compare methods to determine optimal localizations
	- SAD
	- SSD
	- SIFT-vector
	- SAD-vector
	- ZNCC

- new dense process
	- save features
	- get neighbors best locations
	- get statistics
	- belief choosing


2 main problems:
	- don't know when i have my own match vs just the best match available [wrong]
		=> recheck 'reference' scoring
	- don't know how to compare match scores globally

----- old areas not correctly removing priors ?

- look @ color histograms

- how to compare gradient
	-> which methods work best






- restrict before queuing / after popping:
	- is-homogeneous (close) matrix transform
	-

---- keep queue from getting real big -> ignore scores that are lower than existing minimum scores (asigned to a cell)

- Q with no ordering ?
	> only get score initially
	>
	> prne after the fact



- look at variables of a given cell / seed on propagation attempts
	- need way to differentiate good / vs bad matches - locally at least

		=> given a seed cenn
			- it's score
			- neighbors:
				- path scores


NO IDEA ON HOW TO ORDER CHOICES
=> try simultaneous minimization of error / cost

- for each seed match
	- find cost of match
	- for each neighbor [L/R/U/D]:
		- find next possible match / cost / path-cost
		-

Cost Volume

=> be able to not match cells who don't have matches
=>





semi-global matching SGM
filters: LoG, rank, mean,
mutial information
entropy of the histograms
graph cutting
- alpha expansion graph cut



cell:
	- maping costs[]: -- 1 entry for each searched cell
		adjacent[i]: cell(x,y), cost
			- neighbor costs[]: (L/R/U/D = 4):
				cell(x,y), path cost









- loopy belief propagation
https://www.cs.cmu.edu/~epxing/Class/10708-14/scribe_notes/scribe_note_lecture13.pdf
https://cseweb.ucsd.edu/classes/sp06/cse151/lectures/belief-propagation.pdf

- belief update
- reliability
-

Loopy Belief Propagation - Turbo Code
- Bethe approximation
- Gibbs Free energy
- cost computation, cost-volume filtering, winner-take-all



if bipartite -- what are the cuts?
- directional weights ?


graph iteitive ?
	 - expand
	 	- relative weights
	 - pick
	 - prune
	 => repeat

- keep track of 'candidates' in graph, not in queue
-

graph-queue-iteritive
	- go over all 'seeds', finding costs, constructing graph
	- pick best graph, prune
	=> repeat [keep prior graph for next iteration, remember failed edges to prevent re-searching]


'should i keep this neighbor'
'which match should i keep'



------ belief propagation
	- get list of histograms from neighbors
	- update myself
	- send histogram to other neighbors

- pixel i,j : disparity OR occluded
	- allows to treat edge-pixels differently





- compare gradients by directional / dot


- flow / optical flow

- interpolation bad?
- SAD metric bad?
- global compare param?
- fusion of: cell score, path score, uniqueness, ...




- placement / offset wrong?


- relative uniqueness based on range of scores in area

- 'expected' score
	- 'reference' error / score:
	- scale signal to [0,1]
	- add 10% [0.1] error [+/- 0.05]
	- get score as if comparing
		-> rank = (cell score / cell reference score) * (path score / path reference score)



- cells going into clearly the wrong locations
	- are transforms correct?
	- is replacement mechanism being checked ? [don't replace if worse]


- for each cell in left, +- disparity, fing best disparity in opposite image line
	=> limit disparity check to +/- like 50 pixels / 2 cells
- create disparity image from cell assignments

- calculate reversed-rectified image [use table mapping for reverse]






- drop on uniqueness

- what is relative uniquenesss look like?

- error-reference scores (~.1 error)

- are relative match scores good at determining better / worse ?



- progressively loosen matching constraints -> dropping limits, etc ...



- ordering constraints:
	- topoligically similar
	- half-plan ordering x
	- radial ordering x
	- angular ordering ? ... OK -> TEST



INPUT:
	- seed points
		- angle
		- scale
for each seed point:
	- get optimal affine transform
		- rotation, scaleX, scaleY, skewX
	- rank = neighborhood score / seed score
	- add to match queue
while queue is not empty:
	- pop match from queue
	- if cell A already has match || cell B already has match
		- if matchA->B is better than both existing cell matches && new match is of different cells
			- remove existing matches [may be the same]
		- else
			- match = null [not better]
	- if match != null
		- if match still satisfies constraints [ordering, ..?]
			- add matchA->B to final match set
			- TODO: PRUNING IN CONNECTED NEIGHBORHOOD
				-
			- for each neighbor of A and of B [4-or-8-neighbor]
				- interpolate best location as search starting point
				- vary affine transformation to find best local transform & location
					- rotation, scaleX, scaleY, skewX
				- get rank = path score / origin score
				- if match satisfies constraints [ordering, min uniqueness, max score, ... ?]
					- add match to queue



affine:
- rotate angle
- skewX mag
- scaleX mag
- scaleY mag





- fix uniqueness problem: stop repeated cells from showing up

- need to drop / replace duplicate matches [pick better one]



- if a collision (same-cell-match, invalid ordering, ??)
	-> how to resolve?:





RE-ASSESS INDIvIDUAL POINTS OF ALGORITHM:

- affine transform representation [3 points]

IMAGE PREP:
- contrast stretching
- adaptive histogram equalisation
- sharpening










































=> can uniquely find the optimal location
	-> if a location DOESN'T EXIST, it finds the best one available, which is wrong but may have a good score
=> SAD scores between optimal locations are not easily comparable
=> NEED WAY TO DIFFERENTIATE GOOD RESULTS / BAD RESULTS

-> secondary score metrics ?
-> test what a good result would be with addition of noise

- COMMON RESULT
	=> use next-best-score ratio test to drop
- BAD RESULT
	=> ?


- if predicted point is too far away (eg twice the scale distance away)
- if predicted point is in wrong direction (90 deg off of original direction)
- if predicted point has low uniqueness score
- if predicted point has same location when scaled up x2 (stability)
	=> stability also in rotational invariance wich is already been done - record all absolute-location changes in search

- angle error ???

- how to enforce uniqueness / direction


------ other methods to determing good / bad

- direction from pointA to pointB can be used in location A & B to determine separate SAD scores
- line from A to B can itself be tested as a SAD score
	- compare in segments ?
	-
- poorly localized points could still have good scores

-> score is now a 'path' score from getting from A to B [or some combination of the path]
- seed points wont have a path-score & might offset things
-




-> interpolation / prediction might be off

-> maybe triangle interpolation
-> convex hull interpolation

- ordering is still off


- might want to check for duplicate matches in queue?
-> when matching a POP -> if a point is already in cell, don't need to check
-> dup matches should be dropped already ?





https://pdfs.semanticscholar.org/ca92/4f6c0fce953f202547212dc19e7e49db3074.pdf


https://pdfs.semanticscholar.org/ab62/f870909b606f34f6c5843fa736aea65b06db.pdf


- show steps on demand as alg progresses
- set a display flag to true
pick up display flag & show the item


needle
haystack
heat map of SAD scores
display score, uniqueness








- review all steps of algorithm...


- how to remove/update queue
	- shouldn't have multiple matches for same cells ?
		[unless they match different to/from] --- injective


- is interpolation location/scale ok?

- is removing / re-adding matches / points ok
-> dropping from queue too ?

- maybe scaling needs some blurring steps?




- 2 BA modes:
1) get top 100~1000 points & best estimated P
	- racalculate P ongoing
	=> save to pair dirs
		- F, P, pairs
-) combine all view Ps & bundle adjust to get optimum Ps final
2) dense point finding given optimal Ps
	- don't recalculate P as it processd
	- more aggressive error dropping




- find out why particular BAD match is good & howit can be prevented



- dense point matching is letting in some bad matches


- local normalization of image


- look at derivatives


- RELIABITLITY (pick highest RANK)
	- maximum difference of local 4-neighborhood / average difference of 8-neighborhood








- save best ~100 pts from each view's P bundle-adjustment
- combine all bundle-adjustments into final BA
	- output to result view











- show when corner has peak 'cornerness' over scales
	- pixel movement error
- show peak corner scores at different scales for a feature
	- use sift orientation







- once matches have top ~3 do more detailed checks across scales/rotations

- once MSER have been matched [top ~3], match contained corners
	- after all have been considered, then do best-matching



https://github.com/vlfeat/vlfeat
- color histogram over entire area
- HOG:
	- 8x8 binning
	- combine over entire picture ???

VL DENSE SIFT
	http://www.vlfeat.org/overview/dsift.html
	http://www.vlfeat.org/api/dsift.html


https://ags.cs.uni-kl.de/fileadmin/inf_ags/2dip-ss17/2DIP_SS2017_lec07_Descriptors.pdf


https://en.wikipedia.org/wiki/Scale-invariant_feature_transform#Orientation_assignment



- get cutout of MSER feature @ even width/height
- how to get primary gradient orientation
	 - peaks in 'local' gradient goups / bins
- extract feature ~ 2~3 x zoom
- remove very similar match pairs from self-image
- feature compare



	 - get corner-score
	 - do blurring
	 - COM-to-corner * windowingFxn
	 - historgram binning






ORB (Oriented FAST and Rotated BRIEF) — OpenCV-Python Tutorials ...
FAST = Features_from_accelerated_segment_test
GLOH (Gradient Location and Orientation Histogram)
HOG = Histogram of oriented gradients





		R3D.ANMS_Full
		R3D.rangeProfileImagePoint
		R3D.variabilityForPoint

		- circular range gray hard to scale-match
		- variability range gray vaguely matches

- corner-geometry
	- first closest corner with score better than mine

-maximally stable extremal regions
-LaplaceAffine
-HessinanAffine

:::
Matas et al : http://cmp.felk.cvut.cz/~matas/papers/matas-bmvc02.pdf
http://citeseerx.ist.psu.edu/viewdoc/download?doi=10.1.1.93.6657&rep=rep1&type=pdf
http://vbn.aau.dk/files/219488957/tip_preprint.pdf
https://www.mathworks.com/help/vision/ref/detectmserfeatures.html
http://vision.princeton.edu/projects/2012/SUN360/CVPR2012code/code/vlfeat-0.9.5/doc/api/mser_8h.html
http://icvl.ee.ic.ac.uk/DescrWorkshop/featw-papers/Paper_0007.pdf
https://www.hindawi.com/journals/mpe/2012/857210/
https://pdfs.semanticscholar.org/9ad2/74191ee7b41d1f16cccb1aff8ff2d0a026e2.pdf
http://vista.eng.tau.ac.il/publications/KimCuiBroBroPAMI09.pdf
https://github.com/idiap/mser



??? combine with 'corners' to produce different set of points ?
??? stability over scale SIMSER


-> objects only have coarse localization
-> precise localizations need to jiggle parameters [angle,scale,skew] around coarse approximation
-> exact localization needs to do sub-pixel maximizing around peak match




A) see how distortion-correcting helps R/F in current 100-500 iteration process
	-> converting image takes way too long: 10~30s
	-> correction doesn't seem better, maybe worse [line straigtness]
B) implement kNN dropping to output ~1000 best match points
	-
C) save pair match data in some format [F | P | 2d points | 3D points]
	-


D) import pair match data & do real BA on 3 views / 3 pairs
	- how to combine P3D with multiple matches [eg average?]
E) add algorithm piece for doing cross-pair matching to get 3D points with 2+ pairs / 3+ matches
	- to add more points to BA approximation & help remove outliers
F) hierarchical dense matching
	- back to grid ?




UB2GL8EB
JS8R1VXQ



FF6ZQTUH:
from: "R04ZYF8K" 1
to: "9I774XQV" 2

H07XXFHR
from: "UB2GL8EB" 2
to: "9I774XQV" 3


JS8R1VXQ
from: "R04ZYF8K" 1
to: "UB2GL8EB" 3



- want well distributed optimizing points



~ preprocessing step to convert images into warped images from camera distorition
	- faster way to inverse-image ?


- DENSE/pair-P method
	-> determine a camera's best P & best points
- BA method
	-> combine 3+ views into single view



- R3D.BA pick best dense points to do BA
	- kNN error dropping

- BA for multiple cameras / points
	- new file format?



steps:
- initial feature matches
- initial high density matching
	-> best F/R points
- bundle-adjustment to combine multiple views
- restricted high density matching




- covariance of pair of images (via gauge scale)
	- tr(C(x,y,z)) = edge weight = sum of eigenvalues
	- DIRECTIONAL weights




- ...


- HOW TO COMBINE: / WORK WITH
	- multi-scaled dense matching
		- start with lower-res image
		- restrict higher-res searching
	- relative extrinsic matrix determination
		- use most well placed dense matches [highest uniqueness & lowest F / R error]
		- determine top N points between pair
		- BA points+cameras => final
		- contract graph edge
		- ... repeat until all edges contracted




- how does lower-res image handle

- hierarchtical neighbor search structure

- low range dropping ?


- kNN worst score dropping
	~16
- gaussian smoothing ?

- need to bring error down:
	- lower threshold for F/M/R errors
	- lower SAD threshold
	- drop worst F/M/R at end

- do dropping at lower frequency: 20 -> 100 -> 200 ?

- looping behavior prevents new areas from being processed

- would image rectifying make it better?


- a way to exchange DROPPING points to not even saerching the points to begin with?








- DENSE MATCHING:
	- all low separate distance for neighbor SEARCHING vs neighbor
	- larger patch size means search window would need to be different than just radial / angular saerch
		- masking of areas around found points / vs / unsearched area COMs


- on removing a final match -> research the area
	-> GOAL: ALL BEST-POINTS HAVE THEIR PERIMETERS SEARCHED

	- first find highest corner point in area
	- if a point exists, use that
	- else create a new one & corresponding match
	-> search-add-at area
- might this cause looping-ish behavior ?




REVISIT: BAD ESHAISTIVE MATCHING
R3D.bestPairMatchExhaustivePoint
R3D.searchNeedleHaystackImageFlatSADBin
R3D.searchNeedleHaystackImageFlat

=> FOR AREAS -> SIFT IS BETTER
=> FOR LOCAL -> SAD IS BETTER?




-





- are best match points not being selected?
- are worse points not being dropped ?

- more opportunities to drop match because of bad rank

- use corner in metrics
-
- sub-pixel accuracy using surface estimation


- why would combining / merging / overlap be breaking things?

-




- multiple views don't all reduce in error as iteration increases
	- view match counts peaks ~300-400
		-> around 80-90 the R error went down to

	-> see how views do individually ... 1 & 3, 2 & 3
		- 1 & 2 -> F:3, R:2å

- how to combine views' absolute transforms
	-

- with sparse matches on an image how to go to dense matches?
	-
	- pick lowest-error points to get best P relation ? @ end
	- look at directional errors ?
	- only include points with 3+ matches ?
	-
	- use best points as seeds & double resolution & search there

- drop points with 'possibility' of higher error ?
	- angle / direction / distance

- epipolar line ordering constraints

- do basic triangulation using sets of 3 on a given image [delauny]



- POINT COUNT NOT MATCH MATCH SIZE:
	R3DBA.js:1720  0 QUEUE SIZE: 915 MATCHES SIZE: 3317
	R3DBA.js:316 NON-PUTATIVE POINT COUNTS: 0,0,3335


- absolute & relative locations of points / cameras during calculation

- draw matches on bundle image
	-> way to compare results are getting better or worse


- what does a full bundle adjust method look like?
	-


----- overview entire logic again all through





- relative error between cameras is not reducing
	- look at F error
		-> good
	- r error fluctuates a lot


R3D.BA.rError MIGHT HAVE WRONG MATRICES ?
	=>
	errors are now very sporadic

testCams


transform.initialEstimatePoints3D();
info = transform.calculateErrorR(true);


...


- ransac using R not F error ?

- why is there inconsistency in calc of p3d in matches / views
- why do the P3D become fewer and fewer?
	- merging algorithm?

- how to include RANSAC in F / P estimation


- need to remove bad matches from queues too, not just final matches array
- as old matches are dropped, the area needs to be filled as good matches might be skipped over
	-







algorithm with RANSAC
	- get best points for estimating F
		- at least ~50 points
		- at least ~50 lowest error points
		- at least ~50 groups of 3
	- get initial F
	- pixelError = record current average error with initial F [+ sigma]
	- inliers & inlierCounts =
	- minimumInlierCount = ~50% of starting OR 15
	- while next-inlier-count > minimumInlierCount
		best inlier group = []
		for some minimal percent ?????
			- pick random points
			- calculate F
			- find inliers within pixelError
			- keep better inlier group
		pixelError *= 0.5
	- calculate best F with best group
	-> P



-> algs have final global bundle adjustment step:
	- minimize reprojection error over:
		- all 3D points [X,Y,Z]
		- all camera parameters [rx,ry,rz,tx,ty,tz]


http://www.robots.ox.ac.uk/~vgg/data1.html





-> trifocal tensor for merging multiple views
	- calc T from point correspondences
	- get F-,A,V,C from T
	- calc P-A,B,C from T / Fi
	-
	- how to 'combine' these T / P into algorithm ?
		-> graph again ?
	-






- are larger images better performing?

- when a point is dropped (match)
	-> record for when dropping is complete
	-> retry search in area ? (keep if better than previous dropped match)


--- each 2-vide pair has satisfactory 3D projections
	=> but when combined the averages are very noisy
		-> are the 3D positions ABSOLUTE or still somehwo relative?
		-> are the 3D positions averaged together well ?


--- PROBLEM:
	- getting triplets of points doesn't seem to help all that much...
		- only use triplets of points when possible to determine relative camera matrices
		- only keep very 'best' point3Ds for extrinsic matrix calculation
		-
		- leave out putatives

- print out stats for only P3D with 3 nonputative matches

- averaging the positions messes it all up ..
	- try a single 3D from the first view ?
	- maybe the averaging is wrong?



-> NO POINTS3D AFTER 200 ITERATIONS???



--- go thru logics and see if anything doesn't add up

--- try increasing merge distances


--- try to find ways to get single pair matches to become group matches


- 'probing' around P3D results
	- if a neighbor



-> a point3d says it only has a single view / point, but has a match with 2 views
	---> some point3D has a match that has a POINT2D that is not shared by another point2d
		=> after first match is made, subsequent matches are overridden
			eg: p3d = 1-2
				add 1-0
				add 2-0
					=> 2-0 replaces 1-0
	=> SOLUTIONS:
		- combine matches to single point?
			-> this is more like merging
		- use best match, ordered on eg: score / rank






- putative points seem to be orphaned ant left behind

--- match isn't being added / removed from list
-> a match has a point3D who's match is not it

- SHOULD there be a case where a match is replaced on a p3d (projection) ?
	[cause there is]


x try increasing error on what constitutes a 'same' P2D on merge
x lower error drop rates




---- without projection, groups of 3D aren't merging




3D-neighbor probing
	- for each unknown view in P3D
		- look for closest P2D neighbor that has a P3D with 'unknown' view [within some radius]
			=> if found:
				- use transform to look for matching point [neighborhood = radius * 2]
					- blind neighborhood or use directional offset
				- create match if good enough
				- add match as putative to P3D
	- ...




~ NEIGHBOR PROBING:
	- for each view pair
		- repeat until no open area available:
			- search local neighborhood for open area (min open angle), choose most corner-like point (peak?) here
				- include ALL non-putative points
				- exclude ALL putative points who do not have a same view-pair
			- interpolation for opposite view should only include non-putative points
			- create purely putative match

~ POINT3D PROJECTING:
	- for each P3D with a predicted 3D location
		- project 3D location onto un-projected views
		- create a putativ match

x INSERTING:
	- look for any intersection/collisins with NON-PUTATIVE POINTS
	- if no intersection:
		- connect P3D
	- else if intersection
		- remove intersection point
		- merge point and intersection
		- re-insert merged point

MERGING:
	- remove all putative points from P3DA & P3DB
	- each view has max of 2 points
		- if only 1 point, or 2 points are close enough together(set to center)
		- else 2 distinct points
	- each point get's vote based on average of each match's rank
	=> each view has final single location
	- for each view pair, to forward/reverse projection
	- while 'remaining' points error is larger than allowed neighbor distance:
		- the point for each view is the COM of 'remaining' points
		- point with worst error over all views is dropped -> repeat
	- create match for each remaining point-pair @ center points
	- combine matches into single P3D
	- return new P3D
-> if any views are not retained => should neighborhood be searched to add back points



x POPPING PUTATIVE:
	- remove next-best putative match from
	- BEFORE insert:
		- if match is purely putative
			- set to nonputative
		- if match has non-putative elements:
			- disconnect P3D
			- set match to nonputative
			- drop non-putative elements
	- insert match

DROPPING:
	poor matches:
		...
	poor p3d:
		...
	poor p2d:


RESETTING:
	putative matches who's recorded errors have changed
		...




MERGING PROCESS:

	=> get initial view points:
	- for views with 1 point => choose this point
	- for views with more than 1:
		each match votes for a point in each view based on rank
	- choose point with lowest average score

	---- need to keep track of all of:
		- position
		- scale
		- angle

	=> for each view:
		calculate COM
		while any points are outside the COM target area:
			=> if only 2 points:
				drop 2 points -- nonagreed match
			else:
				=> each source point records:
					average total distance from each other point
				=> drop worst point, recalculate COM


	- for all remaining views [at least 2 points remaining]:
		- create a match between view pairs
			- relative angle / scale = AVERAGE of all 'points' involved [if a point is in BOTH views it can/should be counted twice]
				- if a
				- > if any relative angles/scales are off: drop?
		- get match score using averaged position/angles/scales
		- if match score is too poor => drop match
			=> else add to match array


	if 0 matches remain:
		- return original P3D with best average match score?























---- keep all items connected to P3D
---- P2D should be duplicates so that removal is ?... ?
---- should point2d putative be added to the view pointspace?
---- match should remove from P3D if P3D has more than 2 points
---- P3D should remove all 'other' putative matches

how to merge putative with nonputative P3D


- rewrite insert / merge:
	from queue:
		- if P3D only contains 2 point2d
			ok
		- else P3D has at least 1 other nonputative point2d
			- remove match from P3D: [one of match's point2d should be nonputative]
				- if P3D has only 1 match ok
					- disconnect P3D from everything
				- else
					- for pointA & pointB
						- if has only 1 match ok
							- remove point2D from P3D point list
						- else
							- duplicate point location and attach to match
					- remove match from P3D match list
					- create new P3D with same match core points, but new
				- set match points as nonputative
				- insert (now) standalone match

		- set match points as nonputative
		- DO INSERT

	insert:
		- look for intersection of any point2D in corresponding view
		- if no intersections:
			- connect
		- else
			- disconnect intersection
			- merge point & intersection
			- re-insert merged point

	merge:
		- choose A = p3d with better average score as base
		- remove all putative points from p3dA & p3db
		- collect unknown & known view groups
		- for every unknown view of A:
			- for every known view on A:
				- find best location match for unknown view
			- average new locations
			- if new location is near all estimates [~2 pixels]
				- create matches between this new point & known points
		- create new P3D from all new points
		- return new p3D

-- markRemoved probly breaks stuff

--- match not checked for inside view before adding ...

- match intersection should check to see if it's intersecting with itself before doing merge
	=> remove self
	=> check for collision
	=> add self [non-putatives]
- collision:
	- ignore putative points in combining, replace any putatives in

INTERSECTION / COLLISION:
	- remove putative match from P3D if P3D has more than 1 match
	(there should be no such thing as a P3D with all putatives)



- projection of known P3D into unknown views & making matches in queue

- dropping known matches due to P3D changes, P2D changes,

- dropping pending matches to allow for P3D re-projection to possibly better points


---- does merging a single match at a time cause any conflict / duplicated points in same views ?
---- current logic just chooses more-matched set

R3DBA.js:3407 (5) [0, 0, 4338, 24, 0]




- allow closer neighbors : ~ 2 pixels
	- merge at larger distances: ~ 4 pixels

- revisit lense distortion using known method
	- does refinement need to also adjust K values ?
=> 1/1000 % error not tolerated for linear
=> 1/100 % error not tolerated for nonlinear
-> is accuracy the problem?




x keep a queue of matches ordered on rank
x on init, add matches to queue
- each 'iteration' is a series of:
	- pop M matches off queue, and attempt to add
		- insert match
		- search 2D neighborhood to create more matches, until no more space exists
	- go thru all P3D
		- project point to unknown views, create 'temp' match add to queue
	- drop bad matches
		- if count > ~16 & and aspects are too far worse from mean
			- drop
			- use points A & B from dropped match points as P2D neighborhood search

	-

- use corner score as best way to choose base P3D on merging, instead of score / rank

-> get tabs or whatever in app to toggle between actual usage: image upload, view, edit, model

- is P calculation still way off
- is P inversed or altered in some way in the process ?
... why IS reprojection error so bad ?
- sometimes inverted, sometimes not?
	- are all transform methods being used correctly
=> CHECK ALL USAGES



- allow optimum orientation checking on initializing points

- get better population modeling of one-sided errors WHAT DISTRIBUTIONS ARE THESE
	- PRINT OUT DISTRIBUTIONS:
		- score
		- rank
		- f error
		- r error


- can the P3D error be minimized keeping the Ps constant?

	- calculate P
	- refine P
	- refine P3D
	REPEAT ?


- can dense match allow for dropping points ?
	- if it is very different than neighbors ?
	- if score is much worse than neighbors ?
	-

- output dense results & import to BA



- once in a 'stable' location, maybe the Ps stop being linearly estimated?, and jsut reused from last location?

--  is camera K interpolateded correctly
fx / fy / s ?
	- test with different options and see ?


- after first initial matches: some point-pairs may not have a match
	- because match was inserted not derived


- P2D & P3D queue should be based on elements NOT ALREADY ADDRESSED
	- REPEATED CHECKING FOR ELEMENTS

~ if initial projection errors are very big, 3d-point-projection cost may not be worth it


- matching is not robust enough ...


- progressively drop more points with higher criteria (sigma: 4->3->2->1)

- P3D Fail points [to discourage retesting failed locations]

- local P2D searches to see if there's a better match at a neighbor ?

- drop points that project far outside (past margin of error) outside the image

- more 'dense-depth-matching' type prioritization / iterating
	- rank

- worst-matches vs best matches to isolate location of points?

- drop worst P3D points when final exporting

- point scale/rotation may not be very optimal
	... try to retry / refine at some point?




- Trifocal tensor for 3 view approx ?


- look at points 'close' together in 3D space [kNN] and see if the are good matches in 2D
	=> merge

- frop

- is P3D absolute location calculated correctly? (multiple sources)
	- error windows, not just percent averaging


-
projecting:
		- ERROR SOURCES:
			- projection location far off
			- position alignment
			- neighbor angle/scale far off
			- objects move in space [covering/obscuring]
			- asymm scaling of items

	 - optimal locations are wrong
	 	- print out compare points ?
	 - score should be ~ same as average [less than ~2x]
	 - if interpolated 2D points == projected optimal point => good indicator of converging estimations

	 - ignore points if optimal location is on border of search location

- NEED GOOD UNIQUENESS SCORES FOR PROJECTIONS & PROBINGS

	- uniqieness?


- projection via P3D average vs projection via several P3Ds ?? is this possible?


- criteria for removing P3D?
	- average scores median / sigma


CONSERVATION OF SCALE AND ANGLE [ACCURACY IS ONLY WITHIN .1s & 10deg]
- once around any loop in match2Ds should result on 0 angle and 1.0 scale
	-> check to see how off these are
	-> iterate to solution ???



- get new case study set & camera calibration @ same time



- see what undistorted images look like
	-> linear distortion is very bad for reprojection points
		- try nonlinear?
		- try nonlinear with K + dist.
		-


- dynamic dense:
	~ not starting with best points
	~ clustering around other point happens too much
	~ print out images in sequence to test algorithm

- revisit failed points & how they are currently being used?
	- record/reset from F?

- what does using/updating F matrix entail?
	x F-matrix manager
		- on final point decided:
			- recalculate F from points
			- record error statistics
		- as error gets less, recalculate less often
			- stop ~100 ? or error < 1 pixel [or % of cell radius]

	- how to drop points afterwards when F is more accurate ?
		retro dropping
-> not using F actually results in better results
	- use lighter F scoring?

- forward-and back point match searching
	-> whats wrong with symmetric nextB = [] ?????
- sub-pixel accuracy in various points?




CHI-SQUARE DISTRIBUTIONS FOR ERROR:

	Chi-Square: squared normal distributed variable

	k = 1: X
	k = 2: X + X

	mean = k
	sigma = sqrt(2k)


	f(x) = 1/(GAMMA(k/2)*2^(k/2)) * x^(k/2-1) * exp(-x/2)

	@ k = 1:
	= 1/[GAMMA(0.5)*sqrt(2)*k^(-1/2)] * exp(-x/2)



	X^2 = sum [ (ob - ex)^2/ex ]



	MINIMUM => 0


	Observed = ?
	Calculated = ?
	sigma = ?
	chi^2 = sum(i=1 to N): (Observed - Calculated)^2 / sigma^2
		 = (x_i - u)/u


	reduced chi-squared statistic






- intermediary step:
	- pick cell points that look good at higher & higher scales
	1 * cellScore @ 1
	0.5 * cellScore @ 2
	0.25 * cellScore @ 4
	...

github is stupid
https://courses.cs.washington.edu/courses/cse576/13sp/projects/project1/artifacts/ykhlee/Report.htm
	- 40x40 subsampled every 5th pixel
		- low freq filtering
		- localization error
- multi-scale corner detector should use gaussian smoothing & halving, not arbitrary scales


- redesign bundle adjust:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
> need to keep track of attempted & failed neighbor projections [dead ends]
	- these need to be 'reversible' as the model changes & failed points may need revisiting
> need to keep track of projected attempts? [does this just happen every iteration for every point3D w/o a point2D in given view?]


SETUP STEPS:
	- define:
		minNeighborhoodRadius ~5			1		7
		avgNeighborhoodRadius ~11 [target]	2		15
		maxNeighborhoodRadius ~21			4		29

	STRUCTURE PASSING:
x		- for each camera
x			- create a camera object
x		- for each view
x			- create a view object
		- for each view image:
			- undistort image based on view's camera distortion
x		- create a blank transform / match pair for all view pairs
x		- for each match pair
x			- create match object & add to transform
x			- add points to views [using undistorted locations]
x	INITIAL METRICS
x		- for each point match
x			- get descriptor at each of 2 points
x				- record score
x		- for each view match
x			- create transform: R + F
x			- calculate F
	REMOVE CLOSE POINTS:
x		- repeat until no pair is found:
x			- for each 2D point
x				- for each other point in same view
x					- if 2 points are closer than 1/2 min radius
x						COMBINE POINTS
	- RECALCULATE METRICS
		- view-pair M
ITERATION STEPS:
x	- INITIAL PROJECTION
x		- for every view pair with enough point matches [10~16] && no transform F yet:
x			- F
x			- R
x		- calculate METRICS:
x			- points: F, R
x			- pair: F, R

x	- GROUPS [GRAPH]:
x		- estimate absolute positions of each item
x			- error of relation ~ RMS / mean reprojection error

x	- SETUP:
x		prioritize projection queue with 3d points based on:
x			- possible projection exists [not already 'failed'] [if failed attempt is stale, set back to possible proj exsts (r changed less, f changed less)]
x			- average match score
x		prioritize neighbor queue with 2d points based on:
x			- possible check exists (all other views: minimum angle neighbor exists)

	- PROJECTING [expanding P3D base, merge, join, compound]
x		- for P3D in queue:
x			- for each P3D un-matched view:
				- project P3D into view image plane [projectedPoint3DFromPoint3D]
					- if inside image area [inset neighborhood min radius]
						- for each other P3D-matched view
							- use closest ~3-8 2D neighbors to interpolate location, scale, orientation
								- search for several combinations of scale/orientation to find peak match in neighborhood ~ min(rError*2, maxNeighborhoodRadius)
								- scale offset [0.9,1.0,1.1]
								- angle offset [-10,  0, 10]
							- choose best location for other view
						- best point = average of individual other view best points
						- create decriptor at best point
						- if descriptor passes criteria: [minimum range, minimum variability, ?]
							- get matching scores for each other view
							- if each matching score for each other view is better than the average-matching-score for respective views:
								- good match point:
								- if there are other 2D neighbors [within minimum radius]
									- if projection of new point to all neighbors is inside cellRadius
										- combine P3Ds
											- merge all P2D to same P2D
												=> find median point in all other views
												=> need to recheck if any points are now too close to eachother
										- RECORD NEW SCORES FOR CHANGED FEATURES
									- else:
										- SET P3D PROJECTION ATTEMPT TO VIEW AS: FAILED
											- record point, existing views used, r error, f error
								- else:
									- set as new 2D matched point assigned to P3D

x	- PROBING NEIGHBORS [probing, extending]
x		- for P2D in queue:
			- get list of all points in view at distance maximum neighborhood radius
				- for each other view:
					- select only points that have match with other view [including dead-end points]
					- find smallest angle larger than minimum neighborhood angle [~45 degrees]
					- if no angle exists
						- record that point2d's neighborhood is full [dead end] to prevent future searches here
					- else
						- create serach map using minimum radius and maximum radius - min rad [window]
						- find best corner location in this window in view
						- create descriptor at best corner point
						- get ~8 NN around corner point [convex hull if possible] & interpolate scale, angle, position in other view
						- create neighborhood circle mask around estimated location of target radius size
						- search opposite view for best matching location
							- iterate over several relative scales & angles, s=[0.9,1.0,1.1], a=[-10,0,10]
						- create descriptor at points in each view with optimum relative scaling [ie larger item is scaled down]
						- if match score is good for both view's local point matches around:
							- create match between two views & 3D point
						- else
							- create dead-end point in view (not opposite view?)
								- record:
									- m score
									- f error
									- r error [if a point was to be created]
						...
			- ...
	- BLIND SEARCH [guessing, seeding]
 		- pick points in un-covered areas with large corner values
 			- for each view
 				- find large areas with no p2Ds [or FAILs]
 				- pick best point with large corner values
 				- for each other view
 					- search along F line to find best point
 					- if points are good match (score, F, R)
 						=> create new match & P3D

	- RECALCULATE METRICS FROM P2D/P3D
		- each view re-estimate: F, F error, match score
		- determine P3D exact position from each view-pair P2D's putative guess based on reprojection error rates
		- each view re-estimate: R error
	- DROPPING BAD
		- for each view
			- for each p2d
				- drop if way outside (all/any) view's median scores: f, r, m - FOR VIEW GROUPS [compare the point's ferror to the view's ferror] [removes 'singles' with high error]
		- for each p3d
			- drop if way outside (any/all) median scores: f, r, m  - FOR P3D GROUPING [compare the point's reprojection RMS error (over all)] [removes 'groupings' with high error]
		- r check
		- f check
	- REFRESH FAILS
		- if a pair has fewer than ~10 points for F, then transform should be reset to 0 / nil / invalid
		- for each p3D
			- if any failed R or F error has changed [~ half of failed's recorded value] => reset to null to allow new reprojection attempt
		- for each view:
			- for each P2D-Fail
				- if any F error has changed [~ half of failed's recorded value] => remove from view point space [to allow new neighbor attempt]



INIT COMBINING POINTS:
	- P3DA already exists
	- P3DB is being added
		=> calculate scores for each of match pairs [2]
			- A->B & B->A should have close points
				> average midpoint
	P3DA & P3DB

		- choose P3D with better average score to be 'base'
		- for each view-point in P3DB
			- for each view-point P3DA [except for same view]
				- determine optimal scale | position | rotation @ new 'potential point'
			- if all scores and placements are < 2 * avg score & within radius:
				- add or replace P3DA-view-point with new optimal point
		- remove P3DA-set & readd
		- repeat until no collisions


COMBING P3D PROJECTIONS:
	- is score good:
		- add P2D to sets
		- is close:
			- each P3DB known p2d is close to each other known P3DA known
				- use P3D(A) with best score as base
				- remove P3DB
				- add P3DB new points to P3DA based on average location
				=> need to readd to check for other collisions
			- else
				=> FAILED P3D
	- else
		=> FAILED P3D

COMBINING P2D PROBES:
	- is score good:
		- is close:
			* SAME as P3D combine
		- else:
			=> failed P2d
	- else
		=> fail point p2d


camera
	- k
	- distortions
view
	- camera
	- image
	- size
	- points2D [quadtree]
	- absolute transform

transform2D
	- viewA
	- viewB
	- Ffwd / Frev
	- errorFMean
	- errorFSigma
	- errorRMean
	- errorRSigma
	- matches2D[]

point2D
	- x,y
	- matches2D[]
	- point3D
		> if null == DEAD END =>
			> list of attempted compared views & how 'long ago' (in model delta changes) this happened
	- isDeadEnd
		- matches will hold the views attempted


match2D
	- viewA
	- viewB
	- point2dA
	- point2dB
	- score
	- relativeScaleAB
	- relativeAngleAB
	- errorFdistanceAB
	- errorRdistanceAB
	- errorFdistanceBA
	- errorRdistanceBA
	- transform2D

point3D
	- x,y,z
	- points2d[] // place for each view, p2d = exists, fail = tried, null = not tried
	- matches2d[] *?

P3DDeadEnd
	-> result of failed projection
	- location [for single view]
	- R mean error   [for single view]
	- R sigma error
	- F mean error  [for single view]
	- F sigma error
	- M mean error  [if valid reprojection]
	- M sigma error

P2DDeadEnd
	-> result of failed neighbor search resulting in no matches
	- locations[1 for each view]
	- F mean error [across all views]
	- F sigma error
	- M mean error  across all views]
	- M sigma error

world
	- views
	- transforms [relate 2 views]


* if a point2d exists, it will always have a match, a 3d point
* a point2d might be a 'dead end' and have no content other than placed as an unmatched point

....... notes:

- GET LOW-RES DENSE MATCH TO UP F-ESTIMATE MATCHES
	- DROP:
		- 2D points with poor F-distance error (relative to group)
		- 2D points with poor R-distance error (relative to group)
		- 2D points with poor match score
		- low variability (just don't include)
- USE THESE MATCHES AS BASE FOR BA
- IN BA, ALLOW FOR NON-PREDEFINED POINTS TO MATCH
	-> HOW TO MATCH NON-PREDEFINED POINTS?



COMBINING POINTS IN BA:
	- A-B-3D projected to C
		- use closest N points to approximate angle and scale
			- iteritively pic location ? wiggle?
	- if good match:
		- average the best points into single point

		- if not near anything
			- create new point
		- if near other points
			- if VERY CLOSE
				- combine both 3D points somehow
					- which points should adjust?
					- average optimum locations from P3DA with P3DB
			- HOW TO COMBINE ALL MATCHED POINTS?
			- NEED TO ALL HAVE SOME GOOD SIZE-SCALE COMPARRISION??????
				- this is the 'resolution' of the grid
				- min [eg 5] ~ 1/80
				- max [eg 21] ~ 1/20
				- ideal [eg 11] ~ 1/40
			- WHAT IS 'CLOSE'
	- P3d?
		- very close to other P3D
		- all matches are good
		- all F errors are good
		- all R errors are good


- dense matching iteritive cell size matching
	- higher res to lower res ?
	- take lower res best matches & do higher res
		- PREP:
			- each point should allow minor rotation/scale/movement to optimal location
	- adjust F as the number of points increases past original point set ????
		- keep list of matches & scores for calcuating F?
		- need to combine original points with matched points
... dense still trying to match low-range areas



DENSE -> F
drop lowest point matches by:
	score-error
	F-error
RE-DENSE with better F & lower error





- undistort images before F estimate ?
- does this result in better matching ?





-> F-estimate 0 ~ 100
-> dense neighbor search: 100 ~ 50 ~ 200
-> F-estimate 100 ~ 125
...
-> F-estimate ~ 200



- iteritive matching is not acually doing and point maximizing ...
	- currently reduces to the best of the best matches
	- if too few points, it starts grabbing worse point matches
	=> want to pick up more matches too
		- F error
		- match error
		- match second/first ratio

=> optimal F-error / match-score-error goal?
	lower of both
	f*m ?

average error
RMS error


GOAL: limiting F error => force to use more-correct points
	FAIL: lose existing match in
GOAL: choose scores with lower error => choose more-correct points
	FAIL: a mildly better score might be a worse match [non-unique or bad matching]

- keep track of better / previous: match scores / match errors ?




- with best points, zoom out by 2 and pick still best matching -- more stable points?



--- rotational direction is still not accurate
--- feel like there needs to be more points in order to catch everything ==> this might require larger images



----- inner / outer concentric circle comparrisions


x ----- historgram max/min ratio
----- inner mask vs outer mask

- if using corners, how to get orientation?:
	- SIFT maxiumum gradient direction [+/- neighbors @ 80%]
	- corners should have 1 primary direction ?
		- pick zoomed-in carefully gradient primary direction

- extract area image by:
	A) scale to 2ce desired size
	B) blur
	C) scale by half


------ peak gradient average at middle
=> how does this behave AROUND corner ? ---- exact center matter
=> how does this behave with different window sizes
--- picking 'max'/'min' location: largest elevation change (not including end points) of EITHER min or max
--- throw away points that have multiple max/mins ?



- use neighbor corner with highest score [up to ~10 neighbors ... ?]
- use averaging of nearest ~3 neighbors radius sizes
x first neighbor to have a score higher than the next neighbor
- peak in ds/dr [division by 0]
x move-any direction at multiple scales [per pixel or static size] peaks


- corner geometry still not solved for size
	- corners look ok
	- scale for geometry corners not matching up

		- recheck how color gradient performs [currently is ]
		which is better:
			- as-is histograms
			- should offset minimize & normalize scale?

		- scale SAD-SIFT by maxium length >1 around cube intersection
			 -- closest intersction of 3 [6] planes => move into +,+,+ cube & intersect with positive .5,.5,.5 planes

		- figure out how to decide size
			- dcount / dradius
				- 1/2 => 1/1
				- fit parabola ?

		- parabola from point set

		- derivative of parabola => find when slope = m

		- circular sift pattern HOWTO
			- radius size (pixels)
			- r1 = entire inner circle
			- r2 = segmented portion outside r1
				- divide angles by % area in
					- r1 = pi*r^2
					- r2 = pi*(r*3)^2
					- diff = pi*r^2*(9 - 1)
					- r^(i+2) / r^(i) => divide by FLOOR of difference
					: eg:
r1 = 4
areaR1 = pi*r1^2
r2 = 2*r1
areaR2 = pi*r2^2
ratio = areaR2/areaR1 % 4 = (2)^2 => 4 angles
r3 = 3*r1
areaR3 = pi*r3^2
ratio = areaR3/areaR1 % 9 = (3)^2 => 9 angles
...
1   1
4   5
9   14
16  30
25  55
36  91
------ every other:
1   1     1
9   10    2/3
25  35    1/2

GLOH:
1 : 8 : 8
1

			- r3
			... up to some outer r

- METRICS FOR THE ITERITIVE IMPROVEMENT OF 3D MODEL:
	- F point-line distance error
	- 3D->2d reprojection error distance
	- 3D location 'error volume'

	- average/mean error
	-

	- adding a point/pair/3D should reduce error in some way
	- removing a match should reduce error in some way (don't want to remove everything)


- give corner-geometry points scores

- ratio-disqualifying does not seem good
- score subtraction rather than ratio?


x drop very close corner-geometry points

- dropping matches after initial grab
	- bymatch score
	- by F distance

TOO BIG AN AREA ~ everything has a poor score
TOO SMALL AN AREA ~ everything has a good score
	=> do sigma dropping



IMG_7521.JPG
IMG_7525.JPG
IMG_7523.JPG





-- 3DR refininig
	- initial 3-pair views are lined up bad
		-

	- switch from SIFT comparrison to SAD comparrision

	- pair F-related try to aquire more neighbor matches

	- how to do point comparrisons if each point can have multiple scales
		... compare each ? take best score?
	-
	-
	- color 3D dots the color of the pixel(s) it subsumes





- one-sided R3D match search for epipolar lines inside/near image






SAD-SIFT SCORE:
		-- a fair amount of drift on non-distinct items
	- normalized: matches a lot of shitty things as it trails off of seed point
	- unnormalized: trails off





--- KEYS to SIFT DESCRIPTOR:
	- using histogram un-localizes the variables
		- not averaging
		- sums attributes in area
			- minor shifts are tolerated
			- minor changes in gradients are 'averaged' out

	/ saturation (also called “chroma”)

http://infohost.nmt.edu/tcc/help/pubs/colortheory/web/hsv.html


x) SIFT histogram using gray-center RGB 8 quadrants w/ mag = gray-offset vector length
x) color gradient histogram [average-color delta] 8-color quadrant
x) SIFT histogram using hue angle & grayscale-RGB-length as magnitude
x) SIFT histogram R/G/B values
-)
-)



- GOOD COLOR DISTANCE METRIC
	- red is just as different from blue as it is from black

		euclidean:
			sqrt( |ra-rb|^2 + |ga-gb|^2 + |ba-bb|^2 )
		?:
			?
		?:
			?
		?:
			?

	https://en.wikipedia.org/wiki/Color_difference


---- could keep top-matches & do another round of matches using only these tops



try to combine colors in same way SIFT adds gradients:
===== little summaries aggregated over
	color is a magnitude: (light/dark) & 2/3 angles ?
	- binning colors ~ just a lower res [not good differentiator]
	- centers of mass / devecits [seems like a color averaging/scaling]
	- histogram in sub-areas ~ averaging
	> do aggregation at the COMPARE step
		- for each sub-section:


--- in iteritive RANSAC, scores of matches should be used in error metrics

--- drop large corner-geometry features

- tinkering with feature descriptor more
	- size [3-5]
	- falloff
	- flat vs grad combinations
	- blurred vs original
	- rgb/hsv/..
	- clamp high grads
	- 2D vs 6d gradient vectors
	- offsets from 0, min, averages,
	-
	other proprerties:
	2nd derivative


	- scale by entire 144*8 vectors as individual components
	- can scale by maxium 144 vecto

	- HSV ==> HUE IMPORATNT, SAT/VAL LESS SO

	- combine multiple 'flat' metrics




- allow for increasing (dynamic fat matching cut-offs)
	- ~100 minimum


----- try to find scale space maxima for corner points
	- maximum blur - subtraction value for gray
		scale & check value of:
			blur
			entropy
			circular distance SAD subtraction per pixel
			variability per pixel
		- scale profiles
			fxn values at various scales
----- revisit SIFT descriptor


===== performance eval:
	pick a single feature & see the scores among a various bunch of other features

-- plot entropy profiles / values at different scales along with picture of area

-- angle select: most prominant direction
	- high mass vs low mass [from average?]
	- gradients
	-


- compare SAD scores
	- blurring / vs non-blurring
	- with various errors in angle [0,10,20,30,40]



=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-


- allow for multiple point2d with different scales at same point
	= to allow for more matches to be made


- initial matches still fairly poor
	- still have basic color mismatches
		- combine SAD w/ sift (initial try bad)



- add transform error for graph weight based on PAIR F/R error



- before/during feature matching: remove duplicate match-points







joining disjoint groups:









- how to go from refined X points to M matrices ?
	M = f(Xi,xi) @ 6 unknowns rx,ry,rz,tx,ty,tz
	"Pose" from known 3d points
	http://www.uio.no/studier/emner/matnat/its/UNIK4690/v16/forelesninger/lecture_5_2_pose_from_known_3d_points.pdf
	https://dsp.stackexchange.com/questions/1727/3d-position-estimation-using-2d-camera

	http://openmvg.readthedocs.io/en/latest/openMVG/multiview/multiview/

	6pt Direct Linear Transform [HZ],
		7: computaation of camera matrix P

	https://www.cs.umd.edu/class/fall2013/cmsc426/lectures/camera-calibration.pdf

	https://www.cs.utah.edu/~srikumar/cv_spring2017_files/Lecture3.pdf
	http://ags.cs.uni-kl.de/fileadmin/inf_ags/3dcv-ws11-12/3DCV_WS11-12_lec03.pdf

	https://www.safaribooksonline.com/library/view/programming-computer-vision/9781449341916/ch04.html
	http://www.cs.ucf.edu/~bagci/teaching/computervision16/Lec9.pdf
	http://teaching.csse.uwa.edu.au/units/CITS4402/lectures/Lecture08-CameraCalibration.pdf



	http://ksimek.github.io/2012/08/14/decompose/

	https://en.wikipedia.org/wiki/Perspective-n-Point


with known K ?

A) use DLT to find P
.) M = first P_3x3

.) C = null vector of P



A = QR
	R = upper triangular (upper-right)
	Q = orthogonal (Q*Qinv = I)

multiply by Kinv ???

isolate R & t

P = K[R|t]
	PC = 0
	M = KR
	QR decompose
	=> if know K:
		R = Kinv * M ?
=> force orthonormal?
=> ????

numeric.QRFrancis


- upload camera images
	- camera double-check point location checks


- how to derive TFT minimization equations [4]
- trifocal tensor how-to-calculate (from points) / robust iterate
- TFT nonlinear estimation
- TFT sparse

- dense alg:
	- smaller cells are better:
		-for accuracy
	- larger cells are bette:
		- connect space
		- discard mismatching seeds
	-
	- some SAD scores have to be horrible ???
	- does dense use SAD scores at different scales? eg: 1,2,4 ?

- corner feature size should be based on something ...



- recognizing outliers at various points in algorithms -- revisit

fullMatchesForObjects






- triangulate.html broke

- use 2d quadspace to display feature locations onto image

- how images perform with large image
- scrolling zoom gadget via mouse
- scale brush size with gadget


- triangulation not working
- POLY2D error

- triangulate projection textures from camera (from 3D points to 2D points [currently reversed])

- app visualizations
	- 2-view dense match [texture-show]
	- cameras in 3D space along with projections to 3d points
		- filter display by pair or tuple or ALL
	-


ALGORITHM TODO:

TRIPLES:
- from 2 separate dense matches to 3-view tuple
	- for each matched pixel in image A [A-B]
		- is there a match within cellsize/2 radius in [A-C]
		- is the SAD/SIFT matching A-B, B-C, C-A all similar in score ?


BUNDLE ADJUST:

- use triples as a basis for bundle-adjusting
- iterate on: K, P3D (xN), p2d(xNx3), [A-B], [A-C]
	- while total error is decreasing with some minimum velocity:
		- for each triple:
			minimize error for all variables involved in triple
				[K should be fairly fixed ... was determined independently]
				[2d points should be fairly fixed ... ie high-movement should force high-error]
				[3d points should change]
				[Pa,Pb,Pc  should change]
				=>
					change 3D points by some minimum amount (maximum volume dimension * 1E-6)
					change camera positions by some minimum amount (maximum origin volume * 1E-6)
					change camera rotations by some minimum amount ()
		- need to be able to drop matches that contribute a large portion of error
				- if error created by point is above some stddev of rest of data
					- use BEST data [knee point / min count] as population to estimate stddev
		- total error = sum of individual triplet error

	variables:

- data:
	Camera Matrix K:
		- [values]

	Point3D:
		- projections:
			point2D [view A]
			point2D [view B]
	View:
		- transforms:
			transform:
				- T3D[A-B]
		- points:
			- point2D
			...
		- camera K

	point2D:
		source: point3D
		view: View

	Transform3D:
		- viewA
		- viewB
		- matrix


OUTPUT:
	refined K, Camera_i, points2D, points3D


output can be used to:
	- only keep tripled/optimized 3D points [ignore many more ]
	- reproject 2D points to 3D (keep as-is 2d dense matches)
	- reuse triple 3D points as dense matching seeds, to reiterate bundle adjustment
	-






SPEEDUPS:
	- 2x+ using native coding language
	- 2x+ using matrix libraries
	- 10x+ using file i/o [some places]
	- 2x+ using caching [some places]
