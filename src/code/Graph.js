// Graph.js
Graph.WEIGHT_INFINITY = 1E10;
Graph.WEIGHT_EPSILON = 1E-12;
Graph.WEIGHT_NONE = 0;
// ------------------------------------------------------------------------------------------------------------------------
Graph.adjacencyMatrix = function(graph){
	var vertexCount = graph.vertexCount();
	var edgeCount = graph.edgeCount();
	var matrix = Code.newArray2DZeros(vertexCount,vertexCount);
	var i, j, v, u, e;
	for(i=0; i<vertexCount; ++i){
		v = graph.getVertex(i);
		for(j=0; j<vertexCount; ++j){
			u = graph.getVertex(j);
			e = v.getEdgeForVertex(u);
			if(e){
				if(e.direction()==Graph.Edge.DIRECTION_FORWARD){
					if(e.A()==v){
						matrix[i][j] = e.weight();
					}
				}else if(e.direction()==Graph.Edge.DIRECTION_REVERSE){
					if(e.B()==v){
						matrix[i][j] = e.weight();
					}
				}else if(e.direction()==Graph.Edge.DIRECTION_DUPLEX){
					matrix[i][j] = e.weight();
				}
			}
		}
	}
	return matrix;
}
Graph._toBipartiteCostMatrix = function(graph){
	var N = graph.vertexCount();
	var bipartite = Graph._bipartiteSeparated(graph);
	var left = bipartite["left"];
	var right = bipartite["right"];
	var leftCount = left.length;
	var rightCount = right.length;
	var maxCount = Math.max(leftCount,rightCount);
	var costMatrix = Code.newArray2DZeros(maxCount,maxCount);
	for(i=0; i<leftCount; ++i){
		var A = left[i];
		for(j=0; j<rightCount; ++j){
			var B = right[j];
			var edge = A.getEdgeForVertex(B);
			if(edge){
				costMatrix[i][j] = edge.weight();
			}
		}
	}
	console.log( Code.array2DtoString(costMatrix) );
	// turn cost matrix with highest-weights as non-connections
	for(i=0; i<leftCount; ++i){
		for(j=0; j<rightCount; ++j){
			costMatrix[i][j] = Math.abs(costMatrix[i][j]);
		}
	}
	var costInfo = Code.info2DArray(costMatrix);
	var minCost = costInfo["min"];
	var maxCost = costInfo["max"];
	var range = maxCost - minCost; //costInfo["range"];
	console.log(minCost,maxCost);
	for(i=0; i<leftCount; ++i){
		for(j=0; j<rightCount; ++j){
			//costMatrix[i][j] = maxCost - (costMatrix[i][j]-minCost) + minCost;
			costMatrix[i][j] = maxCost - costMatrix[i][j];
		}
	}
	// mapping is important ...
	return {"left":left, "right":right, "costMatrix":costMatrix};
}
Graph.minAssignment = function(graph){ // list of edges
	var costMatrix = Graph._toBipartiteCostMatrix(graph);
	var leftVertexes = costMatrix["left"];
	var rightVertexes = costMatrix["right"];
	costMatrix = costMatrix["costMatrix"];
	var solution = Code.minimizedAssignmentProblem(costMatrix);
	var edges = solution["edges"];
	solution = Graph._minAssignmentToEdgeList(edges, leftVertexes, rightVertexes);
	console.log(solution);
	var cost = solution["cost"];
	return edges;
}
Graph._minAssignmentToEdgeList = function(edges,leftVertexes,rightVertexes){ // return actual edges -- togo inside graph and not here ?
	var i, left, right, pair, edge, len = edges.length;
	var edgeList = [];
	var totalCost = 0;
	for(i=0; i<len; ++i){
		pair = edges[i];
		left = pair[0];
		right = pair[1];
		left = leftVertexes[left];
		right = rightVertexes[right];
		edge = left.getEdgeForVertex(right);
		edgeList.push(edge);
		totalCost += edge.weight();
	}
	return {"cost":totalCost, "edges":edgeList};
}


Graph.minAssignmentStuck = function(graph){ // assignment problem => hungarian algorithm +  O(n^4)
	var i, j, arr, a, b, e, weight, edge, edges, vertex, v, vertexes, bipartite;
	bipartite = Graph._bipartiteSeparated(graph);
	// determing bipartitness
	var leftVertexes = bipartite["left"];
	var rightVertexes = bipartite["right"];
	var allVertexes = graph.vertexes();
	var allEdges = graph.edges();
	console.log(rightVertexes+"");
	console.log(leftVertexes+"");
	// PREPARE: subtract min weight from each edge-group
	// SAVE ORIGINAL WEIGHT:
	arr = allEdges;
	for(i=0; i<arr.length; ++i){
		edge = arr[i];
		edge.temp(edge.weight());
	}
	// SUBTRACT TO GET ZERO-WEIGHT EDGES
	Graph._subtractMinEdgeWeights(rightVertexes);
	Graph._subtractMinEdgeWeights(leftVertexes);


var loops = 0;
// BACK TO LOOP HERE HERE
while(loops<2){
	++loops;
	console.log("    >>>>>     >>>>>     >>>>>     >>>>>     >>>>>     >>>>>     >>>>>     >>>>>     >>>>>    "+loops);
	console.log(graph+"");
	// 1: create 0-weight graph
		var graphZero = new Graph();
		arr = allVertexes;
		for(i=0; i<arr.length; ++i){
			vertex = arr[i];
			v = graphZero.addVertex();
			vertex.temp(v);
			v.id(vertex.id()+"_"+v.id());
		}


		// left forward
		var leftZeroVertexes = [];
		var rightZeroVertexes = [];
		arr = leftVertexes;
		for(i=0; i<arr.length; ++i){
			vertex = arr[i];
			edges = vertex.edges();
			for(j=0; j<edges.length; ++j){
				edge = edges[j];
				if(edge.weight()==0){
					v = edge.opposite(vertex);
					a = vertex.temp();
					b = v.temp();
					//e = graphZero.addEdge(a,b,edge.temp(), Graph.Edge.DIRECTION_FORWARD);
					e = graphZero.addEdge(a,b,1, Graph.Edge.DIRECTION_FORWARD);

					if(!Code.elementExists(leftZeroVertexes,a)){
						leftZeroVertexes.push(a);
					}
					if(!Code.elementExists(rightZeroVertexes,b)){
						rightZeroVertexes.push(b);
					}
				}
			}
		}
		// console.log("GRAPH ZERO:");
		// console.log(graphZero+"");
		// find maximum matching:
		console.log(leftZeroVertexes.length, rightZeroVertexes.length);
		bipartite = Graph._addSourceSink(graphZero, leftZeroVertexes, rightZeroVertexes);
		var source = bipartite["source"];
		var sink = bipartite["sink"];
		console.log("GRAPH ZERO:");
		console.log(graphZero+"");

		// FLIP EDGES:
		for(i=0; i<arr.length; ++i){

		}

		var maxFlow = graphZero.maxFlow(source,sink);
		var maxMatching = maxFlow["edges"];
		var excludedEdges = maxFlow["unused"];
		var maxCut = maxFlow["minCut"];
		graphZero.removeVertex(source);
		graphZero.removeVertex(sink);
		// remove sink/source ends
		for(i=0; i<maxMatching.length; ++i){
			edge = maxMatching[i];
			if(edge.A()==null || edge.B()==null){
				Code.removeElementAt(maxMatching,i);
				--i;
			}
		}
		for(i=0; i<excludedEdges.length; ++i){
			edge = excludedEdges[i];
			if(edge.A()==null || edge.B()==null){
				Code.removeElementAt(excludedEdges,i);
				--i;
			}
		}
		for(i=0; i<maxCut.length; ++i){
			edge = maxCut[i];
			if(edge.A()==null || edge.B()==null){
				Code.removeElementAt(maxCut,i);
				--i;
			}
		}
		console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
		console.log(maxMatching+"");
		console.log(maxCut+"");
		//console.log(excludedEdges+"");
		console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
		// check if matching perfect: (each vertex is included [only once])
		var count = 0;
		arr = graphZero.vertexes();
		for(i=0; i<arr.length; ++i){
			v = arr[i];
			v.temp(1);
		}
		arr = maxMatching;
		var included = [];
		for(i=0; i<arr.length; ++i){
			edge = arr[i];
			console.log(edge+"");
			a = edge.A();
			b = edge.B();
			if(a.temp()>0){
				count += a.temp();
				a.temp(0);
				included.push(a);
			}
			if(b.temp()>0){
				count += b.temp();
				b.temp(0);
				included.push(b);
			}
		}
		var excluded = [];
		arr = graphZero.vertexes();
		for(i=0; i<arr.length; ++i){
			vertex = arr[i];
			if(vertex.temp()>0){
				excluded.push(vertex);
				vertex.temp(0);
			}
		}
		console.log(count+" / "+graphZero.vertexes().length);
		var isPerfect = count == graphZero.vertexes().length;
		if(isPerfect){
			//TODO - convert this to actual graph edges
			return maxMatching;
		}

		// find minimum vertex cover
		console.log("GRAPH ZERO:");
		console.log(graphZero+"");


		var allCuts = [];
		var leftCuts = [];
		var rightCuts = [];
		for(i=0; i<maxCut.length; ++i){
			edge = maxCut[i];
			console.log(edge+"");
			a = edge.A();
			b = edge.B();
			console.log("    "+a);
			console.log("    "+b);
			if(Code.elementExists(leftZeroVertexes,a)){
				leftCuts.push(a);
			}
			if(Code.elementExists(leftZeroVertexes,b)){
				leftCuts.push(b);
			}
			if(Code.elementExists(rightZeroVertexes,a)){
				rightCuts.push(a);
			}
			if(Code.elementExists(rightZeroVertexes,b)){
				rightCuts.push(b);
			}
			allCuts.push(a);
			allCuts.push(b);
		}
		console.log("LLL: "+leftZeroVertexes+"");
		console.log("RRR: "+rightZeroVertexes+"");
		console.log("ALL: "+allCuts+"");
		console.log("LEF: "+leftCuts+"");
		console.log("RIG: "+rightCuts+"");
		minVertexCover = Graph.minVertexCover(graphZero, leftZeroVertexes, rightZeroVertexes, allCuts, leftCuts, rightCuts);
		console.log("MIN VERTEX COVER");
		console.log(""+minVertexCover);


		//minVertexCover = [ minVertexCover[] ];
		minVertexCover = allCuts;

		var minWeight = 0;
		arr = graph.edges();
		for(i=0; i<arr.length; ++i){
			edge = arr[i];
			weight = edge.weight();
			a = edge.A().temp();
			b = edge.B().temp();
			var isAInV = Code.elementExists(minVertexCover,a);
			var isBInV = Code.elementExists(minVertexCover,b);
			if(!isAInV && !isBInV){
				minWeight = Math.min(minWeight, arr[i].weight());
			}
		}
		console.log("minWeight: "+minWeight);
	// 2) perform weight updates:
		arr = graph.edges();
		for(i=0; i<arr.length; ++i){
			edge = arr[i];
			weight = edge.weight();
			a = edge.A().temp();
			b = edge.B().temp();
			var isAInV = Code.elementExists(minVertexCover,a);
			var isBInV = Code.elementExists(minVertexCover,b);
			if(isAInV && isBInV){
				edge.weight(weight + minWeight);
			}else if(!isAInV && !isBInV){
				edge.weight(weight - minWeight);
			}else{
				// keep
			}
		}
		console.log("GRAPH :");
		console.log(graph+"");
	}
	return null;
};
Graph._addSourceSink = function(graph, leftVertexes, rightVertexes, weight){ // for a bartite graph, separate into 2 halves
	weight = weight!==undefined ? weight : 1.0;
	//weight = weight!==undefined ? weight : 999;
	var i;
	// var bipartite = Graph._bipartiteSeparated(graph);
	// var leftVertexes = bipartite["left"];
	// var rightVertexes = bipartite["right"];
	var left = graph.addVertex();
	var right = graph.addVertex();
	for(i=0; i<leftVertexes.length; ++i){
		graph.addEdge(left, leftVertexes[i], weight, Graph.Edge.DIRECTION_FORWARD);
	}
	for(i=0; i<rightVertexes.length; ++i){
		graph.addEdge(rightVertexes[i], right, weight, Graph.Edge.DIRECTION_FORWARD);
	}
	console.log("left: "+left+" / "+leftVertexes.length);
	console.log("right: "+right+" / "+rightVertexes.length);
	return {"graph":graph, "source":left, "sink":right};
}
Graph._bipartiteSeparated = function(graph){ // for a bartite graph, separate into 2 halves
	var i, v, temp, edge, arr, vertex, edges;
	var leftVertexes = [];
	var rightVertexes = [];
	var allVertexes = graph.vertexes();
	var allEdges = graph.edges();
	var edge = allEdges[0];
	var left = edge.A();
	var right = edge.B();
	// check direction
	if( edge.direction()==Graph.Edge.DIRECTION_REVERSE ){
		var temp = left;
		left = right;
		right = temp;
	}
	// LEFT
	arr = leftVertexes;
	vertex = left;
	edges = vertex.edges();
	for(i=0; i<edges.length; ++i){
		edge = edges[i];
		v = edge.opposite(vertex);
		arr.push(v);
	}
	// RIGHT
	arr = rightVertexes;
	vertex = right;
	edges = vertex.edges();
	for(i=0; i<edges.length; ++i){
		edge = edges[i];
		v = edge.opposite(vertex);
		arr.push(v);
	}
	// TODO: check that all vertexes are accounted for & proper bartite graph
	// TODO: check that there are as many edges as there are vertexes for each vertex
	return {"graph":graph, "left":leftVertexes, "right":rightVertexes};
};
Graph._subtractMinEdgeWeights = function(vertexes){
	var i, j, vertex, edge, minEdge;
	for(i=0; i<vertexes.length;++i){
		vertex = vertexes[i];
		edges = vertex.edges();
		minEdge = edges[0].weight();
		for(j=1; j<edges.length; ++j){
			minEdge = Math.min(minEdge,edges[j].weight());
		}
		for(j=0; j<edges.length; ++j){
			edge = edges[j];
			edge.weight( edge.weight() - minEdge );
		}
	}
}
Graph.minVertexCover = function(graph, leftVertexes, rightVertexes, allCuts, leftCuts, rightCuts){
	var i, j, l, r, edge, vertex;
	var S = allCuts;
	var L1 = leftCuts; // left cuts
	var L2 = []; // left not cuts
	for(i=0; i<leftVertexes.length; ++i){
		vertex = leftVertexes[i];
		if( !Code.elementExists(leftCuts, vertex) ){
			L2.push(vertex);
		}
	}
	//
	var R1 = rightCuts;
	var R2 = [];
	for(i=0; i<rightVertexes.length; ++i){
		vertex = rightVertexes[i];
		if( !Code.elementExists(rightCuts, vertex) ){
			R2.push(vertex);
		}
	}
	//
	var B = []; // R2 with neighbors in L1
	for(i=0; i<R2.length; ++i){
		r = R2[i];
		for(j=0; j<L1.length; ++j){
			l = L1[j];
			if(r.isAdjacent(l)){
				B.push(r);
			}
		}
	}
	console.log("===================================================================================================================");
	console.log(S+"  S");
	console.log(L1+" L1");
	console.log(L2+" L2");
	console.log(R1+" R1");
	console.log(R2+" R2");
	console.log(B+"  B");
	// find union
	var C = null;
	C = Code.arrayUnion(L2,R1);
	C = Code.arrayUnion(C,B);
	console.log(C+"");
	return C;
}

Graph._minCut = function(graph,source,sink,returnCut){ // Ford Fulkerson Max Flow
	if(!graph || !source || !sink){
		return null;
	}
	var vertexCount = graph.vertexCount();
	var edgeCount = graph.edgeCount();
	var sourceIndex = graph.indexForVertex(source);
	var sinkIndex = graph.indexForVertex(sink);
	// create adjacency graph
	var capacityMatrix = Graph.adjacencyMatrix(graph);
	// create residual network - flow
	var flowMatrix = Code.newArray2DZeros(vertexCount,vertexCount);
	//
	var i, j, v, path;
	var maxFlow = 0.0;
	path = Graph.BFS(graph, sourceIndex,sinkIndex, capacityMatrix, flowMatrix, true);
var iteration = 0;
	while(path && path.length>0){
if(iteration%100==0){
console.log("ITERATION: "+iteration);
}
if(iteration>=1E4){
	break;
}
		var increment = Graph.WEIGHT_INFINITY;
		// find flow increment
		for(i=path.length;--i;){
			v = path[i];
			u = path[i-1];
			increment = Math.min(increment, capacityMatrix[u][v]-flowMatrix[u][v]);
		}
		// increase flow
		for(i=path.length;--i;){
			v = path[i];
			u = path[i-1];
			flowMatrix[u][v] += increment;
			flowMatrix[v][u] -= increment;
		}
		maxFlow += increment;
		path = Graph.BFS(graph, sourceIndex,sinkIndex, capacityMatrix, flowMatrix, true);
++iteration;
	}



	console.log(Code.array2DtoString(flowMatrix,8,8));

	var cuts = Graph.BFS(graph, sourceIndex,sinkIndex, capacityMatrix, flowMatrix, true, true);
	for(i=0;i<cuts.length;++i){
		cuts[i] = graph.getVertex(cuts[i][0]).getEdgeTo( graph.getVertex(cuts[i][1]) );
	}
	console.log("CUTS: "+cuts.length);
	console.log("CUTS: "+cuts);
	//return maxFlow;


	if(!returnCut){ // return flow instead : set of edges -- resulting flow weights? not internal weights?
		flowEdges = [];
		unusedEdges = [];
		var vertexes = graph.vertexes();
		for(i=0; i<vertexCount; ++i){
			for(j=i+1; j<vertexCount; ++j){
				var a = vertexes[i];
				var b = vertexes[j]; // graph.getVertex(i) ?
				var edge = a.getEdgeTo(b);
				if(!edge){ // opposite direction or N/A
					edge = b.getEdgeTo(a);
				}
				if(flowMatrix[i][j]!==0){ // look at bottom half
					flowEdges.push(edge);
				}else{
					if(edge){
						unusedEdges.push(edge);
					}
				}
			}
		}
		return {"edges":flowEdges, "unused":unusedEdges, "maxFlow":maxFlow, "minCut":cuts};
	}
	return cuts;
}
Graph._disjointSets = function(graph){ //
	var sets = [];
	var i, j;
	var vertexes = Code.copyArray(graph.vertexes());
	if(vertexes.length>0){
		for(i=0; i<vertexes.length; ++i){ // init to unvisited
			vertexes[i].temp(false);
		}
		while(vertexes.length>0){ // for each unconnected grouping
			var queue = [];
			queue.push(vertexes[0]);
			while(queue.length>0){
				var vertex = queue.shift();
				if(!vertex.temp()){
					vertex.temp(true);
					var edges = vertex.edges();
					for(j=0;j<edges.length;++j){
						var edge = edges[j];
						var a = edge.A();
						var b = edge.B();
						if(a==vertex){ // any kind of connection
							queue.push(b);
						}else{
							queue.push(a);
						}
					}
				}
			}
			var set = [];
			for(i=0; i<vertexes.length; ++i){
				var vertex = vertexes[i];
				if(vertex.temp()){
					vertexes.splice(i,1);
					set.push(vertex);
					--i;
				}
			}
			sets.push(set);
		}
		var vertexes = graph.vertexes();
		for(i=0; i<vertexes.length; ++i){
			vertexes[i].temp(null);
		}
	}
	return sets;
}
Graph._minPaths = function(graph,source){ // dijkstra ??
	var i, j;
	var paths = [];
	var vertexes = graph.vertexes();
	if(vertexes.length>1){
		for(i=0; i<vertexes.length; ++i){
			vertexes[i].temp([null,[],[]]);
		}
		source.temp()[0] = 0;
		var queue = [source];
		while(queue.length>0){
			var vertex = queue.shift();
			var edges = vertex.edges();
			for(j=0;j<edges.length;++j){
				var edge = edges[j];
				var a = edge.A();
				var b = edge.B();
				var w = edge.weight();
				var d = edge.direction();
				var to = null;
				if(a==vertex){
					if(d==Graph.Edge.DIRECTION_FORWARD || d==Graph.Edge.DIRECTION_DUPLEX){
						to = b;
					}
				}else{ // b==vertex
					if(d==Graph.Edge.DIRECTION_REVERSE || d==Graph.Edge.DIRECTION_DUPLEX){
						to = a;
					}
				}
				if(to){
					a = vertex.temp();
					b = to.temp();
					if(b[0]===null || b[0]>a[0]+w){
						b[0] = a[0] + w;
						b[1] = Code.copyArray(a[1]);
						b[2] = Code.copyArray(a[2]);
						b[1].push(vertex);
						b[2].push(edge);
						queue.push(to);
					}
				}
			}
		}
		for(i=0; i<vertexes.length; ++i){
			var vertex = vertexes[i];
			var temp = vertex.temp();
			var cost = temp[0];
			var path = temp[1];
			var edges = temp[2];
			paths.push({"vertex":vertex, "cost":cost, "path":path, "edges":edges});
			vertexes[i].temp(null);
		}

	}
	return paths;
}
// Graph.prototype.minPaths = function(source){
// 	var paths = Graph._minPaths(graph,source);
// 	return paths;
// }
Graph._minPath = function(graph,source,target){
	var paths = Graph._minPaths(graph,source);
	for(var i=0; i<paths.length; ++i){
		var path = paths[i];
		if(path["vertex"]==target){
			return path;
		}
	}
	return null;
}

Graph._allPaths = function(graph,source,target){
	// var paths = Graph._minPaths(graph,source);
	// return paths
	// var paths = Graph._minPaths(graph,source);
	// for(var i=0; i<paths.length; ++i){
	// 	var path = paths[i];
	// 	if(path["vertex"]==target){
	// 		return path;
	// 	}
	// }
	return null;
}

Graph._minRootPaths = function(graph,source){ // find best vertex to be at root to minimize all paths thru graph
	var vertexes = graph.vertexes();
	if(vertexes.length<=1){
		return null;
	}
	var i, j;
	var minRoot = null;
	var minPath = null;
	var minCount = null;
	var minEdges = null;
	for(i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var paths = Graph._minPaths(graph,vertex);
		var count = 0;
		var maxPath = null;
		for(j=0; j<paths.length; ++j){
			var cost = paths[j]["cost"];
			var path = paths[j]["path"];
			count += cost;
			if(maxPath===null || maxPath<path.length){
				maxPath = path.length;
			}
		}
		//console.log(i+": "+count+" @ max: "+maxPath);
		if(minPath===null || minCount>count){
			minCount = count;
			minRoot = vertex;
			minPath = paths;
			minEdges = maxPath;
		}
	}
	return {"root":minRoot, "paths":minPath, "height":minEdges, "cost":minCount};
}
Graph._addVistitedVertex = function(graph, vertex, skippedEdges, list){
	if(vertex.temp()==Graph.BFS_COLOR_WHITE){ // is unvisited
		vertex.temp(Graph.BFS_COLOR_BLACK); // set visited
		list.push(vertex);
		var i, edge, other;
		var edges = vertex.edges();
		for(i=0; i<edges.length; ++i){
			edge = edges[i];
			if(!skippedEdges || !Code.elementExists(skippedEdges, edge) ){
				other = edge.opposite(vertex);
				Graph._addVistitedVertex(graph, other, skippedEdges, list);
			}
		}
	}
}
Graph.prototype.subgraphVertexes = function(){
	var vertexes = this.vertexes();
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		vertex.temp(null);
	}
	var q = [];
	var groupCount = 0;
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		if(vertex.temp()===null){
			q.push(vertex);
			while(q.length>0){
				var v = q.pop();
				v.temp(groupCount);
				var es = v.edges();
				for(var j=0; j<es.length; ++j){
					var o = es[j].opposite(v);
					if(o.temp()===null){
						q.push(o);
					}
				}
			}
			++groupCount;
		}
	}
	var groups = Code.newArrayArrays(groupCount);
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var index = vertex.temp();
		groups[index].push(vertex);
		vertex.temp(null);
	}
	return groups;
}
// Graph.reachableFromVertex = function(graph, startVertex){
// 	for(i=0; i<vertexes.length; ++i){
// 		vertex = vertexes[i];
// 		vertex.temp(Graph.BFS_COLOR_WHITE);
// 	}
// 	graph.clearEdgeTemps();
// 	graph.clearVertexTemps();
// 	return reached;
// }

Graph.verticesReachableFromVertexWithoutEdges = function(graph, startVertex, skippedEdges){
	var i, vertex;
	var reachable = [];
	var vertexes = graph.vertexes();
	// set to unvisited
	for(i=0; i<vertexes.length; ++i){
		vertex = vertexes[i];
		vertex.temp(Graph.BFS_COLOR_WHITE);
	} // travel to neighbors and mark as visited
	Graph._addVistitedVertex(graph, startVertex, skippedEdges, reachable);
	graph.clearEdgeTemps();
	graph.clearVertexTemps();
	return reachable;
}
Graph.reachableEdges = function(graph,source){
	return Graph.reachableEdgesAndVertexes(graph,source)["edges"];
}
Graph.reachableVertexes = function(graph,source){
	return Graph.reachableEdgesAndVertexes(graph,source)["vertexes"];
}
Graph.reachableEdgesAndVertexes = function(graph,source){
	var Q = [];
	var edgeList = [];
	var vertexList = [];
	Q.push(source);
	var maxCount = 9999;
	while(Q.length>0){
		// console.log("LOOP: "+Q.length)
		--maxCount;
		if(maxCount<=0){
			throw "max count"
		}
		var vertex = Q.shift();
		// console.log(vertex.temp()+" ?");
		if(vertex.temp()!==Graph.BFS_COLOR_WHITE){
			vertex.temp(Graph.BFS_COLOR_WHITE);
			vertexList.push(vertex);
			
			var edges = vertex.edges();
			for(var i=0; i<edges.length; ++i){
				var edge = edges[i];
				if(edge.temp()!==Graph.BFS_COLOR_WHITE){
					var direction = edge.direction();
					var add = false;
					if(direction == Graph.Edge.DIRECTION_DUPLEX){
						add = true;
						Q.push(edge.opposite(vertex));
					}else if(direction == Graph.Edge.DIRECTION_FORWARD){
						var B = edge.B();
						if(vertex!=B){
							Q.push(B);
							add = true;
						}
					}else if(direction == Graph.Edge.DIRECTION_REVERSE){
						var A = edge.A();
						if(vertex!=A){
							Q.push(A);
							add = true;
						}
					} // else UNKNOWN
					if(add){
						if(edge.temp!==Graph.BFS_COLOR_WHITE){
							edge.temp(Graph.BFS_COLOR_WHITE);
							edgeList.push(edge);
						}
					}
				}
			}
		}
	}
	graph.clearEdgeTemps(edgeList);
	graph.clearVertexTemps(vertexList);
	// throw "tbd";
	return {"edges":edgeList, "vertexes":vertexList};
}
Graph.prototype.reachableEdges = function(source){
	return Graph.reachableEdges(this,source);
}

Graph.prototype.loopsForVertex = function(root, maxEdgeCount){
	maxEdgeCount = Code.valueOrDefault(maxEdgeCount,6); // 3 - 6
	var queue = [];
	var cnt = 0;
	queue.push({"vertex":root, "path":[], "hash":{}});
	var loops = [];
	while(queue.length>0){
		++cnt;
		if(cnt>1E9){
			throw "too many loops";
		}
		var entry = queue.shift(); // front of queue
		var vertex = entry["vertex"];
		var path = entry["path"];
		var hash = entry["hash"];
		var edges = vertex.edges();
		for(var i=0; i<edges.length; ++i){
			var edge = edges[i];
			var edgeID = edge.id();
			if(!hash[edgeID]){ // ignore edges already in list
				var opposite = edge.opposite(vertex);
				var nextP = Code.copyArray(path);
					nextP.push(edge);
				var nextH = Code.copyObject(hash);
					nextH[edgeID] = 1;
				var next = {"vertex":opposite, "path":nextP, "hash":nextH};
				if(opposite==root){ // done
					loops.push(next);
				}else if(nextP.length>=maxEdgeCount){
					// console.log("max loop: "+nextP.length);
				}else{
					queue.push(next);
				}
			}
		}
		//Z
	}
	// console.log("iterations: "+cnt);
	// console.log(loops);
	// unique only: -- opposite directions have a duplicate
	for(var i=0; i<loops.length; ++i){
		var loopA = loops[i];
		var hashA = loopA["hash"];
		var keysA = Code.keys(hashA);
		for(var j=i+1; j<loops.length; ++j){
			var loopB = loops[j];
			var hashB = loopB["hash"];
			var isSame = true;
			var keysB = Code.keys(hashB);
			// check equality, break before
			if(keysA.length!=keysB.length){
				break;
			}
			for(var a=0; a<keysA.length; ++a){
				var keyA = keysA[a];
				if(hashA[keyA]!=hashB[keyA]){
					isSame = false;
					break;
				}
			}
			if(!isSame){
				break;
			}
			for(var b=0; b<keysB.length; ++b){
				var keyB = keysB[b];
				if(hashB[keyB]!=hashA[keyB]){
					isSame = false;
					break;
				}
			}
			if(!isSame){
				break;
			}// else is same
			Code.removeElementAt(loops,j);
			--i;
			// break; // only should be 1 other (reverse) duplicate?
		}
	}
	// to edge list
	for(var i=0; i<loops.length; ++i){
		var loop = loops[i];
		var edges = loop["path"];
		loops[i] = edges;
	}
	// to object
	return {"loops":loops};
}
Graph.prototype.allLoops = function(maxEdgeCount){
	var toIDFxn = function(idList){
		return idList.sort().join("-");
	}
	var vertexes = this.vertexes();
	var loopsByID = {};
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var result = this.loopsForVertex(vertex,maxEdgeCount);
		var loops = result["loops"];
		// to unique:
		for(var j=0; j<loops.length; ++j){
			var loop = loops[j];
			var idList = [];
			for(var k=0; k<loop.length; ++k){
				var edge = loop[k];
				var edgeID = edge.id();
				idList.push(edgeID);
			}
			// console.log(idList);
			var index = toIDFxn(idList);
			// console.log(index);
			loopsByID[index] = loop;
		}
		// throw"?";
	}
	var uniqueLoops = Code.objectToArray(loopsByID);
	return {"loops":uniqueLoops};
}

Graph.BFS_COLOR_UNKNOWN = 0;
Graph.BFS_COLOR_WHITE = 1; // unvisited
Graph.BFS_COLOR_GRAY = 2; // touched
Graph.BFS_COLOR_BLACK = 3; // visited
Graph.BFS = function(graph, search, target, adjacencyMatrix, flowMatrix, indexes, cuts){ // breadth first search - random path between source and target
	var vertexCount = graph.vertexCount();
	var edgeCount = graph.edgeCount();
	var searchIndex = indexes ? search : graph.indexForVertex(search);
	var targetIndex = indexes ? target : graph.indexForVertex(target);
	var predecessorVector = Code.setArrayConstant( new Array(vertexCount), -1);
	var colorVector = Code.setArrayConstant( new Array(vertexCount), Graph.BFS_COLOR_WHITE);
	var queue = new PriorityQueue();
	queue.push(searchIndex);
	colorVector[searchIndex] = Graph.BFS_COLOR_GRAY;
	while( !queue.isEmpty() ){
		i = queue.popMaximum();
		colorVector[i] = Graph.BFS_COLOR_BLACK;
		// if(i==targetIndex) break; // ?
		for(j=0;j<vertexCount;++j){
			if(colorVector[j]==Graph.BFS_COLOR_WHITE && (adjacencyMatrix[i][j] - (flowMatrix ? flowMatrix[i][j] : 0) > 0)){
				predecessorVector[j] = i;
				colorVector[j] = Graph.BFS_COLOR_GRAY;
				queue.push(j);

			}
		}
	}
	if(cuts){
		var s = [], t = [];
		for(i=0;i<vertexCount;++i){
			if(colorVector[i]==Graph.BFS_COLOR_BLACK){
				//console.log("KEEP: "+graph.getVertex(i));
				s.push(graph.getVertex(i));
			}else{
				t.push(graph.getVertex(i));
			}
		}
		var cut = [];
		for(i=0;i<vertexCount;++i){
			for(j=0;j<vertexCount;++j){
				// forward edges
				if( adjacencyMatrix[i][j] != 0){ // an edge exists in original matrix
					if(colorVector[i]==Graph.BFS_COLOR_BLACK && colorVector[j]!=Graph.BFS_COLOR_BLACK){
//						console.log( "CUT: "+i+","+j+" = "+graph.getVertex(i) +" & "+graph.getVertex(j) );
						if(indexes){
							cut.push([i,j]);
						}else{
							cut.push([graph.getVertex(i),graph.getVertex(j)]);
						}
					}
					// reverse edges - don't count in max flow count
					if(colorVector[i]!=Graph.BFS_COLOR_BLACK && colorVector[j]==Graph.BFS_COLOR_BLACK){
						//console.log("ALSO CUT: "+graph.getVertex(i) +" & "+graph.getVertex(j));
						if(indexes){
							cut.push([i,j]);
						}else{
							cut.push([graph.getVertex(i),graph.getVertex(j)]);
						}
					}
				}
			}
		}
		return cut;
		return {"edges":cut,"A":s,"B":t}
	}
	if( colorVector[targetIndex]!=Graph.BFS_COLOR_BLACK ){ // target not reached
		return [];
	}
	i = targetIndex;
	var path = [];
	while(i>=0){
		if(indexes){
			path.unshift( i );
		}else{
			path.unshift( graph.getVertex(i) );
		}
		i = predecessorVector[i];
	}
	return path;
}
Graph.DFS = function(){
	// use stack
	throw "TODO";
}
Graph.prototype.breadthSearchFromVertex = function(root, fxn){ // fxn(vertex,from,root)
	throw "todo";
	var queue = new PriorityQueue();
	queue.push(root);
	var visited = [];
	while( !queue.isEmpty() ){
		var current = queue.pop();
		current.temp();
		var edges = current.edges();
		for(i=0;i<edges.length;++i){
			var next = edges[i].opposite();
		}
		visited.push(current);
	}
	for(i=0;i<visited.length;++i){
		var vertex = visited[i];
		vertex.temp(null);
	}
}
Graph.indexAndCopyVertexFromList = function(copyVertexList, vertexList){ // copy list verbatim
	for(var i=0;i<vertexList.length;++i){
		var v = vertexList[i];
		v.temp(i);
		var u = new Graph.Vertex();
		u.id( v.id() );
		u.data( v.data() );
		copyVertexList[i] = u;
	}
	return copyVertexList
}
Graph.indexAndCopyEdgesFromLists = function(copyEdgeList, copyVertexList, vertexList, skippedEdges){ // replicate edges
	var i, j, u, w, v, d, e, edges;
	for(i=0;i<vertexList.length;++i){
		v = vertexList[i];
		u = copyVertexList[i];
		edges = v.edges();
		for(j=0;j<edges.length;++j){
			e = edges[j];
			if(!skippedEdges || !Code.elementExists(skippedEdges, e) ){
				if(e.A()==v){
					d = new Graph.Edge();
					index = e.B().temp();
					w = copyVertexList[index];
					d.id( e.id() );
					d.weight( e.weight() );
					d.direction( e.direction() );
					d.A( u );
					d.B( w );
					copyEdgeList.push(d);
					u.addEdge(d);
					w.addEdge(d);
				}
			}
		}
	}
	return copyEdgeList;
}
Graph.prototype.aStar = function(startVertex,searchVertex){ // shortest path search - prioritized dijkstra
	// put starting vertex in q
	// while q empty
	// 
	throw "what?"
}
Graph.satelliteVertexesFromEdges = function(edges){ // assuming an incoming connected set from edges
	// console.log(edges);
	// find max vertex id
	var maxVertex = -1;
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var a = edge[0];
		var b = edge[1];
		maxVertex = Math.max(a, maxVertex);
		maxVertex = Math.max(b, maxVertex);
	}
	var vertexCount = maxVertex+1;
	if(vertexCount<=0){
		return {"satellite":[0]}; // assuming single vertex
	}
	// console.log(vertexCount+"/"+maxVertex);
	// make graph
	var graph = new Graph();
	var vertexes = [];;
	for(var i=0; i<vertexCount; ++i){
		var vertex = graph.addVertex();
			vertex.data({"id":i});
		vertexes[i] = vertex;
	}
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		graph.addEdgeDuplex(vertexes[edge[0]], vertexes[edge[1]]);
	}
	// for each vertex removal, see if all other vertexes are reachable
	var completes = [];
	for(var i=0; i<vertexCount; ++i){
		var vertexA = vertexes[i];
		// remove edges
		var es = Code.copyArray(vertexA.edges());
		for(var j=0; j<es.length; ++j){
			var e = es[j];
			graph.removeEdge(e, true);
		}
		// check reached:
		var startIndex = i==0 ? 1 : 0;
		var startVertex = vertexes[startIndex];
		var visited = Graph.verticesReachableFromVertexWithoutEdges(graph, startVertex, null);
		// console.log(" VISIT COUNT: "+visited.length+" ("+es.length+")");
		if(visited.length==vertexCount-1){
			completes.push(i);
		}
		// add back edges
		for(var j=0; j<es.length; ++j){
			var e = es[j];
			graph.addEdge(e);
		}
	}
	return {"satellite":completes};
}

Graph.groupsFromEdges = function(edges, k, tolerance, overlapDesired){ // k groups as independent as possible + some desired overlap
	tolerance = Code.valueOrDefault(tolerance, 1);
// k = 6;
// tolerance = 0;
// tolerance = 1;
	overlapDesired = Code.valueOrDefault(overlapDesired, Math.max(Math.round(k*0.25),1) ); // 25%: 4=>1, 6=>1, 8=>2
// overlapDesired = 4;
	var graph = new Graph();
	// find maximum vertex index
	var maxVertex = -1;
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var a = edge[0];
		var b = edge[1];
		maxVertex = Math.max(a, maxVertex);
		maxVertex = Math.max(b, maxVertex);
	}
	var vertexCount = maxVertex+1;
	// if(k>=vertexCount){
	// 	throw "too many groups: "+k+" >= "+vertexCount;
	// }
	// create vertexes
	var graphVertexes = [];
	for(var i=0; i<=maxVertex; ++i){
		var v = graph.addVertex();
		v.data({"id":i, "vertex":v, "count":0, "groups":{}});
		graphVertexes.push(v);
	}
	// create edges
	var graphEdges = [];
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var a = edge[0];
		var b = edge[1];
		var w = edge[2];
		if(!w){
			w = 1.0;
		}
		a = graphVertexes[a];
		b = graphVertexes[b];
		var e = graph.addEdgeDuplex(a,b,w);
		graphEdges.push(e);
	}
	// set limits
	var groupSize = k;
	var groupSizeMin = groupSize - tolerance;
	var groupSizeMax = groupSize + tolerance;
	var groupCount = Math.max(Math.round(vertexCount/groupSize),1);
// groupCount = 6;
// groupCount = 1;
	// sprinkle group objects around vertexes
	var groups = [];
	var randomVertexes = Code.copyArray(graphVertexes);

// var randomVertexesIndex = [0,1,3,5,9,10,18,20];
	for(var i=0; i<groupCount; ++i){
		var index = Code.randomIndexArray(randomVertexes);
// index = randomVertexesIndex[i];
// console.log(index+"/"+groupCount)
		var vertex = randomVertexes[index];
		Code.removeElementAt(randomVertexes,index);
		var data = vertex.data();
		var group = {};
		group["id"] = i;
		group["nodes"] = [data];
		group["count"] = 1;
		groups.push(group);
			data["count"] = 1;
			data["groups"][group["id"]] = group;
	}

	// iterate:
	var sortMinCost = function(a,b){
		return a["count"] < b["count"] ? -1 : 1;
	};

	var groupFxnGrowFree = function(groupContext){ // if there is an adjacent vertex with 0 groups => add
		var adjacent = groupContext["adjacent"];
		if(adjacent && adjacent.length>0 && adjacent[0]["count"]==0){
			var group = groupContext["group"];
				// console.log("GROW - FREE");
				var node = adjacent[0];
				node["count"] += 1;
				node["groups"][group["id"]] = group;
				group["count"] += 1;
				group["nodes"].push(node);
			return true;
		}
		return false;
	}

	var groupFxnMergeOverlap = function(groupContext){ // for each overlapping group: if the union of nodes is < max size => join & second group = {}
		var overlaps = groupContext["overlaps"];
		// console.log(overlaps);
		if(overlaps){
			var groups = groupContext["groups"];
			var group = groupContext["group"];
			var nodes = group["nodes"];
			var groupID = group["id"];
			var overlapKeys = Code.keys(overlaps);
			var bestMergeID = null;
			var bestMergeSize = null;
			var bestMergeUnion = null;
			for(var i=0; i<overlapKeys.length; ++i){
				var gid = overlapKeys[i];
				if(gid==groupID){
					continue;
				}
				var grp = groups[gid];
				var nds = grp["nodes"];
				var union = {};
				// console.log(nodes);
				// console.log(nds);
				// console.log(grp);
				var uns = [nodes,nds];
				for(var j=0; j<uns.length; ++j){
					var ns = uns[j];
					for(var k=0; k<ns.length; ++k){
						union[ns[k]["id"]] = ns[k];
					}
				}
				// for(var j=0; j<nds.length; ++j){
				// 	union[nds[j]["id"]] = nds[j];
				// }
				var unionCount = Code.keys(union).length;
				if(0<unionCount && unionCount<=groupSizeMax){
					if(bestMergeID===null || unionCount>bestMergeSize){
						bestMergeID = grp["id"];
						bestMergeSize = unionCount;
						bestMergeUnion = union;
					}
				}
			}
			if(bestMergeID!==null){
				console.log("MERGE "+groupID+" & "+bestMergeID+" = "+bestMergeSize);
				var groupA = group;
				var groupB = groups[bestMergeID];
				// remove references from current groups:
				var grps = [groupA,groupB];
				for(var i=0; i<grps.length; ++i){
					var grp = grps[i];
					var nds = grp["nodes"];
					var gID = grp["id"];
					console.log("OF GROUP: "+i+" : "+gID);
					for(var j=0; j<nds.length; ++j){
						console.log("node count: "+nds[j]["count"]+" -> "+nds[j]["count"]);
						nds[j]["count"] -= 1;
						nds[j]["groups"][gID] = null;
						delete nds[j]["groups"][gID];
					}
					grp["count"] = 0;
					grp["nodes"] = [];
				}
				var nodes = Code.objectToArray(bestMergeUnion);
				console.log(nodes.length);
				console.log(nodes);
				// var groupNew = {"id":groupA["id"], "nodes":nodes, "count":nodes.length};
				// keep THIS group, remove other group
				groupA["nodes"] = nodes;
				groupA["count"] = nodes.length;
				var groupAID = groupA["id"];
				for(var j=0; j<nodes.length; ++j){
					nodes[j]["count"] += 1;
					nodes[j]["groups"][groupAID] = groupA;
				}
				return true;
			}
		}
		return false;
	}

	var groupFxnGrowOverlap = function(groupContext){ // if there is any adjacent => add
		var adjacent = groupContext["adjacent"];
		var group = groupContext["group"];
		var groupSize = group["count"];
		if(adjacent && adjacent.length>0 && groupSize<groupSizeMax){
				console.log("GROW - OVERLAP");
				var node = adjacent[0];
				node["count"] += 1;
				node["groups"][group["id"]] = group;
				group["count"] += 1;
				group["nodes"].push(node);
			return true;
		}
		return false;
	}

	var groupFxnShrinkOverlap = function(groupContext){
		var satellite = groupContext["satellite"];
		// console.log(satellite)
		if(satellite && satellite.length>0){ // remove the most overlapping vertex first? maybe least overlapping?
			var node = satellite[satellite.length-1];
			var group = groupContext["group"];
			var groupCount = group["count"];
			if(node["count"]>1 && groupCount>groupSizeMin){ // at least 1 overlap & group will be large enough
				console.log("SHRINK - OVERLAP: "+groupCount);
				var node = satellite[0];
				node["count"] -= 1;
					delete node["groups"][group["id"]];
				group["count"] -= 1;
				Code.removeElement(group["nodes"],node);
			}
			return true;
		}
		return false;
	}

	var groupFxnNewPerimeter = function(groupContext){ // turn a satellite vertex into a new group ...
		var satellite = groupContext["satellite"];
		// find satellite with most adjacent 
		// console.log(satellite)
		if(satellite && satellite.length>0){ // remove the most overlapping vertex first? maybe least overlapping?
			console.log("NEW - PERIMETER");
			// console.log(satellite);
			var maxAdjNode = null;
			var maxAdjCount = null;
			for(var i=0; i<satellite.length; ++i){
				var node = satellite[i];
				var vert = node["vertex"];
				var emptyCount = 0;
				var adjacent = vert.adjacent();
				for(var j=0; j<adjacent.length; ++j){
					var adj = adjacent[j];
					var data = adj.data();
					// console.log(data["count"]);
					if(data["count"]==0){
						++emptyCount;
					}
				}
				if(maxAdjNode===null || emptyCount>maxAdjCount){
					maxAdjNode = node;
					maxAdjCount = emptyCount;
				}
			}
			// remove node from group
			var group = groupContext["group"];
				Code.removeElement(group["nodes"],maxAdjNode);
				group["count"] -= 1;
			maxAdjNode["count"] -= 1;
			delete maxAdjNode["groups"][group["id"]];
			
			// create new group of size 1:
			var groups = groupContext["groups"];
			var newGroup = {"id":groups.length, "nodes":[maxAdjNode],"count":1};
			maxAdjNode["count"] += 1;
			maxAdjNode["groups"][newGroup["id"]] = newGroup;
			console.log(newGroup);
			groups.push(newGroup);
			return true;
		}
		return false;
	}
	var getGroupContext = function(group,groups){
		var adjacent = {};
		var internal = {};
		var interrior = {};
		var perimeter = [];
		// find ajacent vertexes
		var overlapGroupsCount = 0;
		var overlapTable = {};
		var groupID = group["id"];
		for(var j=0; j<nodes.length; ++j){
			var node = nodes[j];
			if(node["count"].length>1){ // keep track of overlap
				overlapGroupsCount += 1;
			}
			// get list of 
			var nodeGroups = node["groups"];
			var nodeKeys = Code.keys(nodeGroups);
			for(var k=0; k<nodeKeys.length; ++k){
				var key = nodeKeys[k];
				if(key==groupID){
					continue;
				}
				var val = overlapTable[key];
				if(!val){
					val = 0;
				}
				val += 1;
				overlapTable[key] = val;
			}
			var id = node["id"];
			var vertex = node["vertex"];
			internal[id] = node;
			var adj = vertex.adjacent();
			for(var k=0; k<adj.length; ++k){
				var data = adj[k].data();
				adjacent[data["id"]] = data;
			}
		}
		var overlapMaxCount = 0;
		// find contained points = vertex with only interrior edges
		internal = Code.objectToArray(internal);
		// remove internal from adj
		for(var j=0; j<internal.length; ++j){
			var node = internal[j];
			adjacent[node["id"]] = null;
		}
		adjacent = Code.objectToArray(adjacent);
		for(var j=0; j<adjacent.length; ++j){
			var node = adjacent[j];
			if(node==null){
				Code.removeElementAt(adjacent,j);
				--j;
			}
		}


		var internalEdges = [];
		for(var a=0; a<internal.length; ++a){
			var vA = internal[a]["vertex"];
			for(var b=a+1; b<internal.length; ++b){
				var vB = internal[b]["vertex"];
				var edge = vA.isAdjacent(vB);
				if(edge){
					internalEdges.push([a,b]);
				}
			}
		}
		// console.log("internalEdges: ",internalEdges);
		var satellite = Graph.satelliteVertexesFromEdges(internalEdges); // list of vertexes that can be removed and remain in-tact list
			satellite = satellite["satellite"];
		for(var s=0; s<satellite.length; ++s){
			satellite[s] = internal[satellite[s]];
		}
		adjacent.sort(sortMinCost);
		internal.sort(sortMinCost);
		satellite.sort(sortMinCost);
		
		// console.log(i+" : "+internal.length+"("+interrior.length+" - "+perimeter.length+") & "+adjacent.length);
		// console.log(i+" : "+interrior.length+" -- "+adjacent.length);

		var groupContext = {};
			groupContext["internal"] = internal; // group memebers
			groupContext["satellite"] = satellite; // group members who can be removed without disjointing group
			groupContext["adjacent"] = adjacent; // external neighbors
			groupContext["group"] = group;
			groupContext["groups"] = groups;
			groupContext["overlaps"] = overlapTable; // groups with vertexes in common
		return groupContext;
	}

	console.log("GROUP SIZE: "+groupSize+": ["+groupSizeMin+" - "+groupSizeMax+"]  vertexCount "+vertexCount);
// throw "..."
	// var maxIterations = 10;
	// var maxIterations = 20;

	// var maxIterations = 1;
	// var maxIterations = 2;
	// var maxIterations = 3;
	// var maxIterations = 4;
	// var maxIterations = 5;
	// var maxIterations = 6;
	// var maxIterations = 7;
	// var maxIterations = 8;
	// var maxIterations = 9;
	// var maxIterations = 10;
	// var maxIterations = 13;
	// var maxIterations = 20;
	// var maxIterations = 30;
	// var maxIterations = 50;
	var maxIterations = groupSizeMax*2; // full growing + split gorwing
	for(var iteration=0; iteration<maxIterations; ++iteration){
		// for each group perform operations locally
		// console.log(iteration+" ......................................................................................... ")
		for(var i=0; i<groups.length; ++i){
			var group = groups[i];
			// skip empty groups
			var nodes = group["nodes"];
			var nodeCount = nodes.length;
			if(nodeCount==0){
				continue;
				// throw "empty group, continue";
			}
			var groupContext = getGroupContext(group, groups);
			var handledGroup = false;
			// SMALL
			if(nodeCount<groupSizeMin){
				if(!handledGroup){
					handledGroup = groupFxnGrowFree(groupContext);
				}
				if(!handledGroup){
					handledGroup = groupFxnMergeOverlap(groupContext);
				}
				if(!handledGroup){
					handledGroup = groupFxnGrowOverlap(groupContext);
				}
			// MEDIUM
			}else if(groupSizeMin<=nodeCount && nodeCount<=groupSizeMax){
				if(!handledGroup){
					handledGroup = groupFxnGrowFree(groupContext);
				}
				if(!handledGroup){
					handledGroup = groupFxnMergeOverlap(groupContext);
				}
				if(!handledGroup){
					handledGroup = groupFxnShrinkOverlap(groupContext);
				}
			// LARGE
			}else{
				if(!handledGroup){
					handledGroup = groupFxnNewPerimeter(groupContext);
				}
				if(!handledGroup){
					handledGroup = groupFxnGrowFree(groupContext);
				}
				if(!handledGroup){
					handledGroup = groupFxnMergeOverlap(groupContext);
				}
				if(!handledGroup){
					handledGroup = groupFxnShrinkOverlap(groupContext);
				}
			}
			// STEADY
			if(!handledGroup){
				console.log("no op: "+nodeCount);
			}
		} // groups
	} // loop
	
	var overlapMinimum = function(groups, table){
		var minValue = null;
		var keys = Code.keys(groups);
		for(var k=0; k<keys.length; ++k){
			var key = keys[k];
		// for(var i=0; i<groups.length; ++i){
			var group = groups[key];
			// console.log(group);
			var groupID = group["id"];
			var value = table[groupID];
			if(!value){
				value = 0;
			}
			if(minValue===null || value<minValue){
				minValue = value;
			}
		}
		return minValue;
	}
	var leastEntries = function(groupA, groupB, table){
		var overlapA = overlapMinimum(groupA, table);
		var overlapB = overlapMinimum(groupB, table);
		// console.log(overlapA,overlapB);
		return overlapA<overlapB ? -1 : 1;
	}
	// make sure each group has some overlap with other groups:
	// start with smaller groups first:
	groups.sort(function(a,b){
		return a["count"] < b["count"] ? -1 : 1;
	});
	console.log("ADD OVERLAP WITH NEIGHBORS");
	if(groups.length>1){
		for(var i=0; i<groups.length; ++i){
			var group = groups[i];
			// skip empty groups
			var nodes = group["nodes"];
			var nodeCount = nodes.length;
			if(nodeCount==0){
				continue;
			}
			// get count of current overlap
			var groupContext = getGroupContext(group, groups);
			var overlaps = groupContext["overlaps"];
			var overlapKeys = Code.keys(overlaps);
			var overlapCount = 0;
			for(var k=0; k<overlapKeys.length; ++k){
				var key = overlapKeys[k];
				var val = overlaps[key];
				overlapCount += val;
			}
			console.log(overlapCount+" /?/ "+overlapDesired);
			if(overlapCount>=overlapDesired){
				continue;
			}
			// if need more:
			var sortHaveLeast = function(a,b){
				var groupA = a["groups"];
				var groupB = b["groups"];
				return leastEntries(groupA,groupB, overlaps);
			}
			var adjacent = groupContext["adjacent"];
			if(adjacent.length==0){
				// console.log(group);
				throw "reached end of adj list?";
				// console.log("reached end of adj list?");
				continue;
			}
			adjacent.sort(sortHaveLeast);
			console.log(adjacent);
			console.log(overlaps);
			var groupID = group["id"];
			for(var a=0; a<adjacent.length; ++a){
				var adj = adjacent[a];
				// ADD:
					group["nodes"].push(adj);
					group["count"] += 1;
					adj["groups"][groupID] = group;
					adj["count"] += 1;
				++overlapCount;
				if(overlapCount>=overlapDesired){
					// console.log("done early");
					break;
				}
			}
			// done?
			if(overlapCount>=overlapDesired){
				continue;
			}
			// if no more cells => repeat
			// console.log("add more - repeat");
			--i; // repeat
		}
	}

	console.log(overlapDesired);

	// convert groups to sets of vertexes
	var lists = [];
	for(var i=0; i<groups.length; ++i){
		var group = groups[i];
		var vList = group["nodes"];
		if(vList.length==0){
			continue;
		}
		var ids = [];
		for(var j=0; j<vList.length; ++j){
			ids.push(vList[j]["id"]);
		}
		lists.push(ids);
	}
	return {"groups":lists, "overlap":[]};
}


Graph.partitionFromEdges = function(edges, k, initialVertexes){
	throw "partitionFromEdges";
}

Graph.groupsFromEdges2 = function(edges, k, initialVertexes){
	console.log(edges);
	console.log(k);
	if(initialVertexes){
		console.lgo(initialVertexes);
		throw "initialVertexes"
	}
	var graph = new Graph();
	var maxVertex = -1;
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var a = edge[0];
		var b = edge[1];
		maxVertex = Math.max(a, maxVertex);
		maxVertex = Math.max(b, maxVertex);
	}
	var vertexCount = maxVertex-1;
	if(k>=vertexCount){
		throw "too many groups";
	}
	var graphVertexes = [];
	for(var i=0; i<=maxVertex; ++i){
		var v = graph.addVertex();
		graphVertexes.push(v);
	}
	console.log(graphVertexes);
	var graphEdges = [];
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var a = edge[0];
		var b = edge[1];
		var w = edge[2];
		if(!w){
			w = 1.0;
		}
		a = graphVertexes[a];
		b = graphVertexes[b];
		var e = graph.addEdgeDuplex(a,b,w);
		graphEdges.push(e);
	}
	var groupSize = k;
	var groupCount = Math.ceil(vertexCount/groupSize);
	console.log(graphEdges);
	console.log(groupSize);
	console.log(groupCount);
	// make 
	var masses = [];
	var availableVertexes = Code.copyArray(graphVertexes);
	for(var i=0; i<groupCount; ++i){
		var index = Code.randomIndexArray(availableVertexes);
		var v = availableVertexes[index];
		var mass = {};
			mass["vertex"] = v;
		masses.push(mass);
		v.data(mass);
		Code.removeElementAt(availableVertexes, i);
	}
	console.log(masses);
	// iterate
	var maxIterations = 10;
	// calcualate forces from all directions
	console.log(graph);
	console.log("minPaths");
	var paths = graph.minPathsAll();
	console.log(paths);

	// set carriers
	for(var i=0; i<masses.length; ++i){
		var mass = masses[i];
		var forces = {};
		mass["forces"] = forces;
		var v = mass["vertex"];
		var adjacent = v.adjacent();
console.log(adjacent);
		for(var j=0; j<adjacent.length; ++j){
			var id = adjacent[j].id();
			forces[id] = 0;
		}
	}
	throw "?";
	for(var iteration=0; iteration<maxIterations; ++iteration){
		for(var a=0; a<masses.length; ++a){
			var massA = masses[a];
			var vA = massA["vertex"];
			// console.log(massA);
			var path = paths[a];
			for(var b=0; b<masses.length; ++b){
				if(a==b){
					continue;
				}
				var massB = masses[b];
				var vB = massB["vertex"];
				// console.log(massB);
				var p = null;
				for(var i=0; i<path.length; ++i){
					if(path["vertex"]==vB){
						p = i;
						break;
					}
				}
var ppp = graph.minPath(vA,vB);
// console.log(ppp);
var edges = ppp["edges"];
var edge = edges[edges.length-1];
var distance = ppp["cost"];
console.log(edge);
console.log("... "+distance);
				console.log(p);
				p = path[p];
				console.log(p);

				var force = 1.0/distance;
				var entryAB = {"force":force};

				var forcesA = massA["forces"];


				console.log(massA);
				console.log(massB);
				// console.log(path);
				// console.log(p);
				// origin edge & 
				throw "jere"
			}
		}
		// update - sum forces
		for(var a=0; a<masses.length; ++a){
			// 
		}
		// move masses
		for(var a=0; a<masses.length; ++a){
			// force large enough?
			// space available?
			// move
		}

		break;
	}

	throw "groupsFromEdges";

	//

	return {"groups":null};
}
Graph.splitGraphFromEdgeCut = function(graph,cut){ // this will likely break if the cut isn't a true cut
	if(!cut || cut.length==0){
		return null;
	}
	var i, edge, vertex, v, u;
	edge = cut[0];
	var vertexA = edge.A();
	var vertexB = edge.B();
	//
	// all reachable vertexes fromA
	var vertexListA = Graph.verticesReachableFromVertexWithoutEdges(graph, vertexA, cut);
	var vertexListB = Graph.verticesReachableFromVertexWithoutEdges(graph, vertexB, cut);
	// copy vertexes and edges
	var copyVertexListA = Graph.indexAndCopyVertexFromList([], vertexListA);
	var copyVertexListB = Graph.indexAndCopyVertexFromList([], vertexListB);
	var copyEdgeListA = Graph.indexAndCopyEdgesFromLists([], copyVertexListA, vertexListA, cut);
	var copyEdgeListB = Graph.indexAndCopyEdgesFromLists([], copyVertexListB, vertexListB, cut);
	// cleanup
	graph.clearEdgeTemps();
	graph.clearVertexTemps();
	// create new
	var graphA = new Graph();
	var graphB = new Graph();
	graphA._vertexes = copyVertexListA;
	graphA._edges = copyEdgeListA;
	graphB._vertexes = copyVertexListB;
	graphB._edges = copyEdgeListB;
	// return both craphs
	return [graphA,graphB];
}
Graph.copy = function(graph){
	var i, j, index, d, e, u, v, w, edges;
	var vertexesA = graph.vertexes();
	var edgesA = graph.edges();
	// copy vertexes and edges
	var vertexesB = Graph.indexAndCopyVertexFromList([], vertexesA);
	var edgesB = Graph.indexAndCopyEdgesFromLists([], vertexesB, vertexesA, null);
	// cleanup
	graph.clearEdgeTemps();
	graph.clearVertexTemps();
	// new graph
	graph = new Graph();
	graph._vertexes = vertexesB;
	graph._edges = edgesB;
	return graph;
}
// ------------------------------------------------------------------------------------------------------------------------
function Graph(){
	// these should maybe be lookup? for O(1) remove ?
	this._vertexes = [];
	this._edges = [];
}
Graph.prototype.toString = function(){
	return "[Graph V:"+this._vertexes.length+" E:"+this._edges.length+"]";
}
Graph.prototype.clearEdgeTemps = function(edges){
	if(!edges){
		edges = this._edges;
	}
	for(var i=edges.length; i--;){
		edges[i].temp(null);
	}
}
Graph.prototype.clearVertexTemps = function(vertexes){
	if(!vertexes){
		vertexes = this._vertexes;
	}
	for(var i=vertexes.length; i--;){
		vertexes[i].temp(null);
	}
}
Graph.prototype.edges = function(){
	return this._edges;
}
Graph.prototype.vertexes = function(){
	return this._vertexes;
}
Graph.prototype.allVertexes = function(){ // copy return
	console.log(this._vertexes);
	var i, len = this._vertexes.length;
	var arr = [];
	for(i=0; i<len; ++i){
		arr.push(this._vertexes[i]);
	}
	return arr;
}
Graph.prototype.noEdgeVertexes = function(){ // copy return
	console.log(this._vertexes);
	var i, len = this._vertexes.length;
	var arr = [];
	for(i=0; i<len; ++i){
		var v = this._vertexes[i];
		if(v.edges().length==0){
			arr.push(v);
		}
	}
	return arr;
}
Graph.prototype.vertexFromData = function(data){
	for(var i=0; i<this._vertexes.length;++i){
		var v = this._vertexes[i];
		if(v.data()==data){
			return v;
		}
	}
	return null;
}
Graph.prototype.edgeForVertexes = function(a,b){
	var edges = a.edges();
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		if(edge.opposite(a)==b){
			return edge;
		}
	}
	return null;
}
Graph.prototype.containsEdge = function(e){
	return Code.elementExists(this._edges, e);
}
Graph.prototype.containsVertex = function(v){
	return Code.elementExists(this._verte, v);
}
Graph.prototype.BFS = function(from, to){
	return Graph.BFS(this, from,to, Graph.adjacencyMatrix(this));
}
Graph.prototype.setAllVertexVisited = function(v){
	var i;
	var arr=this._vertexes;
	var len = arr.length;
	for(i=0; i<len; ++i){
		arr[i]._visited = v;
	}
}
Graph.prototype.getVertex = function(i){
	if(i<this._vertexes.length){
		return this._vertexes[i];
	}
	return null;
}
Graph.prototype.indexForVertex = function(v){
	return Code.indexOfElement(this._vertexes,v);
}
Graph.prototype.addVertex = function(inVertex){
	var vertex = (inVertex!==undefined) ? inVertex : new Graph.Vertex(); //  && Code.isa(inVertex,Graph.Vertex)
	this._vertexes.push(vertex);
	return vertex;
}
Graph.prototype.removeVertex = function(v){
	if(v!==undefined && v!==null){
		var edges = Code.copyArray(v.edges());
		for(var i=0; i<edges.length; ++i){
			var edge = edges[i];
			this.removeEdge(edge);
		}
		Code.removeElementSimple(this._vertexes,v);
	}
	return v;
}
Graph.prototype.removeEdge = function(e, keepVertexes){
	if(e!==undefined && e!==null){
		var a = e.A();
		var b = e.B();
		a.removeEdge(e);
		b.removeEdge(e);
		Code.removeElementSimple(this._edges,e);
		if(keepVertexes){
			e._vertexA = a;
			e._vertexB = b;
		}else{
			e.kill();
		}
	}
	return e;
}
Graph.prototype.vertexCount = function(){
	return this._vertexes.length;
}
Graph.prototype.averageConnectivity = function(){
	var vertexes = this._vertexes;
	var len = vertexes.length;
	var count = 0;
	for(var i=0; i<len; ++i){
		var vertex = vertexes[i];
		var edgeCount = vertex.degree();
		count += edgeCount;
	}
	if(len>0){
		count = count/len;
	}
	return count;
}
Graph.prototype.addEdge = function(a,b,w,d){
	var edge = null;
	if(arguments.length==1){
		// console.log("EXISTING ...")
		edge = a;
		var a = edge.A();
		var b = edge.B();
		edge._vertexA = null;
		edge._vertexB = null;
		// edge.A(null);
		// edge.B(null);
		edge.A(a);
		edge.B(b);
		// TODO: make sure edge is removed
	}else{
		edge = new Graph.Edge(a,b,w,d);
	}
	this._edges.push(edge);
	return edge;
}
Graph.prototype.addEdgeDuplex = function(a,b,w){
	var edge = (arguments.length==1) ? a : new Graph.Edge(a,b,w, Graph.Edge.DIRECTION_DUPLEX);
	this._edges.push(edge);
	return edge;
}
Graph.prototype.edgeCount = function(){
	return this._edges.length;
}
Graph.prototype.minCut = function(source,sink){
	return Graph._minCut(this,source,sink, true);
}
Graph.prototype.maxFlow = function(source,sink){
	return Graph._minCut(this,source,sink, false);
}
Graph.prototype.copy = function(){
	return Graph.copy(this);
}
Graph.prototype.splitWithCut = function(cut){
	return Graph.splitGraphFromEdgeCut(this,cut);
}
Graph.prototype.minPaths = function(source){
	return Graph._minPaths(this,source);
}
Graph.prototype.minPathsAll = function(){
	var list = Code.copyArray(this._vertexes);
	// var hash = {}
	for(var i=0; i<list.length; ++i){
		var vertex = list[i];
		var paths = this.minPaths(vertex);
		list[i] = paths;
	}
	return list;
}
Graph.prototype.allPaths = function(source,target){
	return Graph._allPaths(this,source,target);
}
Graph.prototype.minPath = function(source,target){
	return Graph._minPath(this,source,target);
}
Graph._ufHashing = function(obj){
	return obj.id()+"";
}

Graph.prototype.mergeVertexes = function(vertexA,vertexB, combineVertexFxn, combineEdgeFxn){
	// edge must exist
	var edge = vertexA.edge(vertexB)
	if(!edge){
		throw "no shared edge to retract";
	}
	var combinedVertex = this.addVertex();
	var edgesA = vertexA.edges();
	var edgesB = vertexB.edges();
	// combine all common edges
	var edgesCommon = [];
	var edgesSingle = [];
	var edgesShared = [];
	// console.log(edgesA);
	// console.log(edgesB);
	for(var i=0; i<edgesA.length; ++i){
		var edgeA = edgesA[i];
		var oppoA = edgeA.opposite(vertexA);
		if(oppoA == vertexB){
			edgesShared.push(edgeA);
			continue;
		}
		var edgeB = oppoA.edge(vertexB);
		if(edgeB){
			console.log("common A 1 - "+oppoA.data()[0].id()+" - "+vertexA.data()[0].id());
			console.log("common A 2 - "+oppoA.data()[0].id()+" - "+vertexB.data()[0].id());
			edgesCommon.push([edgeA,edgeB, oppoA]);
		}else{
			//console.log(oppoA.data());
			console.log("single A - "+oppoA.data()[0].id()+" - "+vertexA.data()[0].id());
			edgesSingle.push([edgeA,oppoA]);
		}
	}
	for(var i=0; i<edgesB.length; ++i){
		var edgeB = edgesB[i];
		var oppoB = edgeB.opposite(vertexB);
		if(oppoB == vertexA){
			continue;
		}
		var edgeA = oppoB.edge(vertexA);
		if(!edgeA){
			console.log("single A - "+oppoB.data()[0].id()+" - "+vertexB.data()[0].id());
			edgesSingle.push([edgeB,oppoB]);
		} // else already found in loop 1
	}
	// combine common edges:
	console.log("common edges: "+edgesCommon.length);
	console.log("single edges: "+edgesSingle.length);
	for(var i=0; i<edgesCommon.length; ++i){
		var common = edgesCommon[i];
		var edgeA = common[0];
		var edgeB = common[1];
		var opposite = common[2];
		if(combineEdgeFxn){
			var edge = combineEdgeFxn(combinedVertex,opposite, edgeA,edgeB);
		}else{
			var weight = edgeA.weight() + edgeB.weight();
			var edge = this.addEdgeDuplex(combinedVertex,opposite, weight);
		}
	}
	// create new edges:
	for(var i=0; i<edgesSingle.length; ++i){
		var old = edgesSingle[i];
		var e = old[0];
		var v = old[1];
		var w = e.weight()
		var edge = this.addEdgeDuplex(combinedVertex,v, w);
	}
	if(combineVertexFxn){
		combineVertexFxn(combinedVertex, vertexA,vertexB);
	}
	//vertexA.removedEdges();
	//vertexB.removedEdges();
	this.removeVertex(vertexA);
	this.removeVertex(vertexB);

	//throw "mergeVertexes";
	return combinedVertex;
}

Graph.prototype.minSpanningTree = function(){ // minimum spanning tree MST -- assumes bidirectional edges
	var edges = Code.copyArray(this.edges());
	var keep = [];
	var included = [];
	var excluded = [];
	if(edges.length>0){
		// add vertexes to union-find
		var toHash = function(o){ return o.id()+"" };
		var uf = new UnionFind(toHash);
		var vertexes = this.vertexes();
		for(var i=0; i<vertexes.length; ++i){
			uf.addSet(vertexes[i]);
		}
		// sort edges on lower weight
		edges.sort(function(a,b){
			return a.weight()<b.weight() ? -1 : 1;
		});
		// pick best edges first
		for(var i=0; i<edges.length; ++i){
			var edge = edges[i];
			var vertexA = edge.A();
			var vertexB = edge.B();
			var isSame = uf.isSameSet(vertexA,vertexB);
			// console.log(" "+i+": "+isSame);
			if(!isSame){
				var joined = uf.union(vertexA,vertexB);
				keep.push(edge);
			}
		}
		var sets = uf.allSets();
		var set0 = uf.setFromObject(edges[0].A());
		included = set0.allObjects();
		for(var i=0; i<sets.length; ++i){
			var set = sets[i];
			if(set!=set0){
				var arr = set.allObjects();
				Code.arrayPushArray(excluded, arr);
			}
		}
		uf.kill();
	}
	// TODO: included / excluded
	return {"edges":keep, "included":included, "excluded":excluded};
}
Graph.prototype.minSpanningTreeDirected = function(){ 
	throw "TODO";
}
Graph.prototype.minRootPaths = function(){
	return Graph._minRootPaths(this);
}
Graph.prototype.disjointSets = function(){
	return Graph._disjointSets(this);
}

Graph.prototype.adjacent = function(data){ // connects to vertex via edge : neighbors
	var vertex = this.vertexFromData(data);
	var result = [];
	if(vertex){
		var adjacent = vertex.adjacent();
		for(var i=0; i<adjacent.length; ++i){
			var adj = adjacent[i];
			result.push(adj.data());
		}
	}
	return result;
}

Graph.prototype.skeletalEdges = function(maxErrorMultiple){ // connected MST with no more than maximum error
	// assumes connected graph ?
	var graph = this;
	
	var t = Code.valueOrDefault(maxErrorMultiple, 4.0); // 4-16
	var importanceMinumum = Math.min(4.0/t,1.0);
	
	var vertexes = graph.vertexes();
		vertexes = Code.copyArray(vertexes);
	var vertexCount = vertexes.length;
	var allEdges = graph.edges();
		allEdges = Code.copyArray(allEdges); // original count
	var edges = Code.copyArray(allEdges); // working set
	var edgeCount = edges.length;
	var pairIDFxn = Graph._pairIDFxn;

// console.log("ORIGINAL EDGES: "+allEdges.length);

	// local storage
	var edgeDatas = {};
	for(var i=0; i<edgeCount; ++i){
		var edge = edges[i];
		var edgeID = edge.id();
		edgeDatas[edgeID] = {};
	}
	var vertexDatas = {};
	for(var i=0; i<vertexCount; ++i){
		var vertex = vertexes[i];
		var vertexID = vertex.id();
		vertexDatas[vertexID] = {"color":0};
	}

	// calculate the shortest path between every pair of vertexes = sum
	var minPathLookup = {};
	var pairIDFxn = Graph._pairIDFxn;
	for(var i=0; i<vertexes.length; ++i){
		var vertexA = vertexes[i];
		var paths = graph.minPaths(vertexA);
		for(var j=0; j<paths.length; ++j){
			var path = paths[j];
			var vertexB = path["vertex"];
			var cost = path["cost"];
			var pairID = pairIDFxn(vertexA.id(),vertexB.id());
			minPathLookup[pairID] = cost;
		}
	}
// console.log(minPathLookup);
// console.log("BEFORE  EDGES: "+allEdges.length);
	// get edge importance = shortestLength/edgeLength & reset edge weight as importance
	var removedEdges = [];
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var data = edgeDatas[edge.id()];
		var vertexA = edge.A();
		var vertexB = edge.B();
		var weight = edge.weight();
		var pairID = pairIDFxn(vertexA.id(),vertexB.id());
		var minPathCost = minPathLookup[pairID];
		if(minPathCost==0){
			throw "no zeros";
		}
		var importance = minPathCost/weight;
		data["weight"] = edge.weight();
		data["importance"] = importance;
		// console.log("importance: "+importance+" FROM "+data["weight"]);
		edge.weight(importance);
		// remove edges below some minimum importance
		if(importance<importanceMinumum){
			Code.removeElementAt(edges,i);
			--i;
			graph.removeEdge(edge, true);
			removedEdges.push(edge);
		}
	}
// console.log("SECOND EDGES: "+allEdges.length);

	// find best vertex to add: highest degree = most importance
	var bestVertex = null;
	var bestDegree = 0;
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var degree = vertex.degree();
		if(!bestVertex){
			bestVertex = vertex;
			bestDegree = degree;
		}else if(bestDegree<degree){
			bestVertex = vertex;
			bestDegree = degree;
		}
	}

	// loop - add vertexes to graph from queue
	var sortVertexFxn = function(a,b){
		if(a==b){
			return 0;
		}
		// not DEGREE, most white neighbors
		var da = a.degree();
		var db = b.degree();
		if(da==db){
			// console.log(a);
			// var ia = a.weight();
			// var ib = b.weight();
			// if(ia==ib){
				return a.id()<b.id() ? -1 : 1; // choose one
			// }
			// return ia<ib ? -1 : 1;
		}
		return da<db ? -1 : 1;
	}
	var queue = new PriorityQueue(sortVertexFxn);
	queue.push(bestVertex);

	// find skeleton edges
var c=0;
	while(!queue.isEmpty()){
		var currentVertex = queue.pop();
		var currentData = vertexDatas[currentVertex.id()];
		var color = currentData["color"];
		if(color==2){ // already added all edges
			continue;
		}
		currentData["color"] = 2;
		// add each unvisited edge to graph
		var adj = currentVertex.edges();
		for(var i=0; i<adj.length; ++i){
			var edge = adj[i];
			var other = edge.opposite(currentVertex);
			var otherData = vertexDatas[other.id()];
			if(otherData["color"]==0){ // not yet added to group
				otherData["color"] = 1;
				queue.push(other);
				var edgeData = edgeDatas[edge.id()];
				edgeData["skeleton"] = true;
			}
		}
++c;
if(c>1000){
	console.log("too many iterations?");
	console.log(queue);
	throw "?";
}

	}

	// remove non-skeleton edges:
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var edgeData = edgeDatas[edge.id()];
		if(!edgeData["skeleton"]){
			Code.removeElementAt(edges,i);
			--i;
			graph.removeEdge(edge, true);
			removedEdges.push(edge);
		}

	}

	// add back edges to satisfy minimum error constraint -------------------------------------
	// cache calculation for interrior vs exterrior:
	for(var i=0; i<removedEdges.length; ++i){
		var edge = removedEdges[i];
			var interriorA = edge.A().degree()>1;
			var interriorB = edge.B().degree()>1;
		var edgeData = edgeDatas[edge.id()];
		edgeData["interrior"] = interriorA && interriorB;
	}

	// set all edges back to weight from importance:
console.log("BACK TO WEIGHT: "+allEdges.length);
	for(var i=0; i<allEdges.length; ++i){
		var edge = allEdges[i];
		var edgeID = edge.id();
		var data = edgeDatas[edgeID];
		var weight = data["weight"];
		edge.weight(weight);
	}

	// sort by adding unused edges to queue
	var sortEdgeFxn = function(a,b){
		if(a==b){
			return 0;
		}
		a = edgeDatas[a.id()];
		b = edgeDatas[b.id()];
		var intA = a["interrior"];
		var intB = b["interrior"];
		if(intA && !intB){
			return -1;
		}else if(!intA && intB){
			return 1;
		} // else same
		return a["weight"] < b["weight"] ? -1 : 1; // lower weight or higher importance ? (lower error)
	}

	queue.sorting(sortEdgeFxn);
	for(var i=0; i<removedEdges.length; ++i){
		var edge = removedEdges[i];
		queue.push(edge);
	}
	
	// add back edges until min stretch factor achieved
	removedEdges = queue.toArray();
	for(var i=0; i<removedEdges.length; ++i){
		var edge = removedEdges[i];
		// this edge cost:
			// var weight = edge.weight();
		// original graph min cost
			var pairID = pairIDFxn(vertexA.id(),vertexB.id());
			var weight = minPathLookup[pairID];
		var vertexA = edge.A();
		var vertexB = edge.B();
		var path = graph.minPath(vertexA,vertexB);
		var cost = path["cost"];
		var maxRatio = weight*t;
		if(cost>maxRatio){
			console.log("add back : "+cost+" / "+weight+" ? "+maxRatio);
			graph.addEdge(edge);
			Code.removeElementAt(removedEdges,i);
			--i;
			edges.push(edge);
		}
	}
// console.log(allEdges);
// console.log(removedEdges);
// throw "removedEdges"

	// mark interrior / leaf nodes:
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var degree = vertex.degree();
		var data = vertexDatas[vertex.id()];
		if(degree==1){
			data["interrior"] = false;
			data["leaf"] = true;
		}else{
			data["interrior"] = true;
			data["leaf"] = false;
		}
	}

	var fullEdges = Code.copyArray(edges);
	var fullVertexes = Code.copyArray(vertexes);

	// groups are interrior nodes + all leaves
	var groups = [];
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var data = vertexDatas[vertex.id()];
		if(data["interrior"]){
			var groupEdges = null;
			var groupVertexes = null;
			var adj = vertex.edges();
			for(var j=0; j<adj.length; ++j){
				var edge = adj[j];
				var opposite = edge.opposite(vertex);
				var oppositeData = vertexDatas[opposite.id()];
				if(oppositeData["leaf"]){
					if(!groupVertexes){
						groupEdges = [];
						groupVertexes = [];
						groupVertexes[vertex.id()] = vertex; // only needs to be added once
					}
					groupEdges.push(edge);
					groupVertexes[opposite.id()] = opposite;
				}
			}
			if(groupEdges!=null){
				groupVertexes = Code.objectToArray(groupVertexes);
				var group = {"edges":groupEdges, "vertexes":groupVertexes};
				groups.push(group);
			}
		}
	}

	// group pairs are all leaf nodes connected to single backbone node
	var groupPairs = [];
	// console.log("GROUPS: "+groups.length);
	for(var i=0; i<groups.length; ++i){
		var group = groups[i];
		var lm1 = group.length-1;
		var interrior = group[lm1];
		var pairs = [];
		groupPairs.push(pairs);
		for(var j=0; j<lm1; ++j){
			var edge = group[j];
			pairs.push([interrior,edge]);
		}
	}

	// skeleton pairs are all edges in skeleton set:
	var skeletonEdges = [];
	var skeletonVertexes = {};
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var a = edge.A();
		var b = edge.B();
		if(vertexDatas[a.id()]["interrior"] && vertexDatas[b.id()]["interrior"]){
			skeletonEdges.push(edge);
			skeletonVertexes[a.id()] = a;
			skeletonVertexes[b.id()] = b;
		}
	}
	skeletonVertexes = Code.objectToArray(skeletonVertexes);
	if(skeletonVertexes.length==0){
		console.log(vertexDatas);
		for(var i=0; i<vertexes.length; ++i){
			var vertex = vertexes[i];
			// console.log(vertex);
			if(vertexDatas[vertex.id()]["interrior"]){
				skeletonVertexes.push(vertex); // should be just 1
			}
		}
		console.log("no edges ... single vertex is skeleton");
	}

	// restore to original state: add all edges back:
	console.log("add back remaining: "+removedEdges.length);
	for(var i=0; i<removedEdges.length; ++i){
		var edge = removedEdges[i];
		graph.addEdge(edge);
	}
	removedEdges = null;

	// return
	var skeleton = {"edges":skeletonEdges, "vertexes":skeletonVertexes};
	var returnObject = {"edges":fullEdges, "vertexes":fullVertexes, "groups":groups, "skeleton":skeleton};
	// console.log(returnObject);
	// throw "skeletalSet"
	return returnObject;
}
Graph.prototype.clear = function(){
	var edges = this._edges;
	var vertexes = this._vertexes;
	for(var i=0; i<edges.length; ++i){
		edges[i].kill();
	}
	for(var i=0; i<vertexes.length; ++i){
		vertexes[i].kill();
	}
	this._edges = [];
	this._vertexes = [];
}
Graph.prototype.kill = function(){
	this.clear();
	this._edges = null;
	this._vertexes = null;
}
// ------------------------------------------------------------------------------------------------------------------------
Graph.Vertex = function(d){
	this._data = null;
	this._id = Graph.Vertex._index++;
	this._edges = [];
	this._temp = null;
	this.data(d);
}
Graph.Vertex._index = 0;
Graph.Vertex.prototype.kill = function(){
	this._id = null;
	this._data = null;
	edges = this._edges;
	if(edges){
		Code.emptyArray(edges);
	}
	this._edges = null;
	this._temp = null;
}
Graph.Vertex.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
Graph.Vertex.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
Graph.Vertex.prototype.data = function(d){
	if(d!==undefined){
		this._data = d;
	}
	return this._data;
}
Graph.Vertex.prototype.isAdjacent = function(v){
	var adjacent = this.adjacent();
	return Code.elementExists(adjacent,v);
}
Graph.Vertex.prototype.adjacent = function(){ // vertexes touching : neighbors
	var vertexes = [];
	var edge, i, len = this._edges.length;
	for(i=0; i<len; ++i){
		edge = this._edges[i];
		vertexes.push(edge.opposite(this));
	}
	return vertexes;
}
Graph.Vertex.prototype.getEdgeForVertex = function(v){
	var i, e, len, arr=this._edges;
	len = arr.length;
	for(i=0;i<len;++i){
		e = arr[i];
		if( e.connectsVertexes(this,v) ){
			return e;
		}
	}
	return null;
}

Graph.Vertex.prototype.getEdgeTo = function(v){
	var i, e, len, arr=this._edges;
	len = arr.length;
	for(i=0;i<len;++i){
		e = arr[i];
		if(e.direction()==Graph.Edge.DIRECTION_FORWARD){
			if(e.A()==this && e.B()==v){
				return e;
			}
		}else if(e.direction()==Graph.Edge.DIRECTION_REVERSE){
			if(e.A()==v && e.B()==this){
				return e;
			}
		}else if(e.direction()==Graph.Edge.DIRECTION_DUPLEX){
			if( e.connectsVertexes(this,v) ){
				return e;
			}
		}
	}
	return null;
}
Graph.Vertex.prototype.addEdge = function(e){
	if(e!==undefined && e!==null){
		this._edges.push(e); // Code.addUnique(this._edges,e);
	}
	return e;
}
Graph.Vertex.prototype.removeEdge = function(e){
	if(e!==undefined && e!==null){
		Code.removeElementSimple(this._edges,e);
	}
	return e;
}
Graph.Vertex.prototype.edges = function(){
	return this._edges;
}
Graph.Vertex.prototype.edge = function(opposite){
	var edges = this._edges;
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		if(edge.opposite(this)==opposite){
			return edge;
		}
	}
	return null;
}
Graph.Vertex.prototype.degree = function(){
	return this._edges.length;
}
Graph.Vertex.prototype.edgesTo = function(){
	var edges = [];
	var i, e, len = this._edges.length;
	for(i=0; i<len; ++i){
		e = this._edges[i];
		if(e.direction()==Graph.Edge.DIRECTION_FORWARD){
			if(e.B()==this){
				edges.push(e);
			}
		}else if(e.direction()==Graph.Edge.DIRECTION_REVERSE){
			if(e.A()==this){
				edges.push(e);
			}
		}else if(e.direction()==Graph.Edge.DIRECTION_DUPLEX){
			edges.push(e);
		}
	}
	return edges;
}
Graph.Vertex.prototype.edgesFrom = function(){
	var edges = [];
	var i, e, len = this._edges.length;
	for(i=0; i<len; ++i){
		e = this._edges[i];
		if(e.direction()==Graph.Edge.DIRECTION_FORWARD){
			if(e.A()==this){
				edges.push(e);
			}
		}else if(e.direction()==Graph.Edge.DIRECTION_REVERSE){
			if(e.B()==this){
				edges.push(e);
			}
		}else if(e.direction()==Graph.Edge.DIRECTION_DUPLEX){
			edges.push(e);
		}
	}
	return edges;
}
Graph._pairIDFxn = function(a,b){
	if(a<b){
		return a+"-"+b;
	}
	return b+"-"+a;
}
Graph.prototype.display2D = function(edgesAsDistances){ // get list of 2d positions
	// ~n^2 body problem, iteritive
	var vertexes = this._vertexes;
	var edges = this._edges;
	var bodies = [];
	var springs = [];

	var springLookup = {};
	var pairLookup = {};
	var bodyLookup = {};

	var pairIDFxn = Graph._pairIDFxn;

	// create bodies for each vertex
	var maxDegree = 0;
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var degree = vertex.edges().length;
		maxDegree = Math.max(maxDegree,degree);
		var body = {};
			body["vertex"] = vertex;
			body["position"] = new V2D();
			body["connected"] = [];
			body["unconnected"] = [];
			body["accumulator"] = new V2D();
			body["processed"] = false;
			body["degree"] = degree;
		bodies.push(body);
		bodyLookup[vertex.id()] = body;
	}
	for(var i=0; i<edges.length; ++i){
		var edge = edges[i];
		var spring = {};
			spring["edge"] = edge;
			spring["ideal"] = 1.0; // or edge length ?
			spring["length"] = 0;
		springs.push(spring);
		springLookup[edge.id()] = spring;
		var pairID = pairIDFxn(edge.A().id(),edge.B().id());
		pairLookup[pairID] = spring;
	}

	// initial conditions:

// TODO: lower connectivity points on outside, higher inside
// TODO: perturbation / iterations on connectivity heuristics
	var radius = 1.0; // random point for each vertex inside radius = maximum edge length
	for(var i=0; i<bodies.length; ++i){
		var body = bodies[i];
		var position = body["position"];
		var degree = body["degree"];
		var p = degree/maxDegree;
		var q = 1.0-p;
		var radMin = radius*q;
		var radRange = radius*p;
		var a = Math.random()*Math.PI*2.0;
		var r = radMin + radRange*Math.random();
		position.set(r*Math.cos(a),r*Math.sin(a));
	}

	var k1 = 2.0;
	var k2 = 1.0;
	var k3 = 1.0;
	var k4 = 0.10;

	var maxIterations = 1000;
	// var maxIterations = 100;
	// var maxIterations = 10;
	var minimumForce = 0.001;
	var forceStepScale = 0.1;

	var forceDir = new V2D();
	var dirAB = new V2D();
	for(var iteration=0; iteration<maxIterations; ++iteration){
		// accumulate forces
		for(var i=0; i<bodies.length; ++i){
			var bodyA = bodies[i];
			var positionA = bodyA["position"];
			var accumulatorA = bodyA["accumulator"];
			
			for(var j=i+1; j<bodies.length; ++j){
				var bodyB = bodies[j];
				var positionB = bodyB["position"];
				var accumulatorB = bodyB["accumulator"];

				var pairID = pairIDFxn(bodyA["vertex"].id(),bodyB["vertex"].id());
				var spring = pairLookup[pairID];

				V2D.sub(dirAB,positionB,positionA);
				var distanceAB = dirAB.length();

				var forceAB = 0;
				forceDir.copy(dirAB);
				if(spring){ // connected
					var idealDistance = spring["ideal"];
					forceAB = k1*Math.log(distanceAB/idealDistance);
					// negative means distanceAB < idealDistance => PUSH APART
					// positive means distanceAB > idealDistance => PULL TOGETHER
					if(forceAB<0){ // push apart
						forceDir.flip();
					} // else pull together
					forceAB = Math.abs(forceAB);
				}else{ // unconnected
					forceAB = k3/Math.pow(distanceAB,2);
					if(forceAB>0){
						forceDir.flip();
					}
				}
				// accumulate force
				forceDir.length(k4*forceAB);
				accumulatorA.add(forceDir);
				accumulatorB.sub(forceDir);
				
			}
		}
		// apply forces
		for(var i=0; i<bodies.length; ++i){
			var body = bodies[i];
			var position = body["position"];
			var accumulator = body["accumulator"];
			accumulator.scale(k4);
			position.add(accumulator);
			accumulator.set(0,0); // reset for next round
		}

	} // end iterations
	
	// force

	var positions = [];
	for(var i=0; i<vertexes.length; ++i){
		var vertex = vertexes[i];
		var body = bodyLookup[vertex.id()];
		var position = body["position"];
		positions.push(position);
	}
	// move to center
	// TODO - scale to size radius max = 1
	var info = V2D.infoArray(positions);
	var com = info["center"];
	var size = info["size"];
	size = 1.0/Math.max(size.x,size.y);
	for(var i=0; i<positions.length; ++i){
		var position = positions[i];
		position.sub(com);
		position.scale(size);
	}
	return {"positions":positions, "vertexes":vertexes, "edges":edges};
}
Graph.Vertex.prototype.toString = function(){
	return "[Vertex "+this._id+" ("+this._edges.length+")]";
}
// ------------------------------------------------------------------------------------------------------------------------
Graph.Edge = function(a,b,w,d){
	this._id = Graph.Edge._index++;
	this._vertexA = null;
	this._vertexB = null;
	this._weight = Graph.WEIGHT_NONE;
	this._direction = Graph.Edge.DIRECTION_UNKNOWN;
	this._temp = null;
	this._data = null;
	this.A(a);
	this.B(b);
	this.weight(w);
	this.direction(d);
}
Graph.Edge._index = 0;
Graph.Edge.prototype.kill = function(){
	this._id = null;
	this._vertexA = null;
	this._vertexB = null;
	this._weight = null;
	this._direction = Graph.Edge.DIRECTION_UNKNOWN;
	this._data = null;
	this._temp = null;
}
Graph.Edge.prototype.data = function(d){
	if(d!==undefined){
		this._data = d;
	}
	return this._data;
}
Graph.Edge.prototype.id = function(i){
	if(i!==undefined){
		this._id = i;
	}
	return this._id;
}
Graph.Edge.prototype.temp = function(t){
	if(t!==undefined){
		this._temp = t;
	}
	return this._temp;
}
Graph.Edge.DIRECTION_UNKNOWN = 0;
Graph.Edge.DIRECTION_FORWARD = 1;
Graph.Edge.DIRECTION_REVERSE = 2;
Graph.Edge.DIRECTION_DUPLEX = 3;
Graph.Edge.prototype.weight = function(w){
	if(w!==undefined){
		this._weight = w;
	}
	return this._weight;
}
Graph.Edge.prototype.direction = function(d){
	if(d!==undefined){
		this._direction = d;
	}
	return this._direction;
}
Graph.Edge.prototype.connectsVertexes = function(v,u){
	if( (this._vertexA==v && this._vertexB==u) || (this._vertexA==u && this._vertexB==v) ){
		return true;
	}
	return false;
}
Graph.Edge.prototype.A = function(a){
	if(a!==undefined){
		if(this._vertexA != a && this._vertexA){
			this._vertexA.removeEdge(this);
		}
		this._vertexA = a;
		if(this._vertexA){
			this._vertexA.addEdge(this);
		}
	}
	return this._vertexA;
}
Graph.Edge.prototype.B = function(b){
	if(b!==undefined){
		if(this._vertexB != b && this._vertexB){
			this._vertexB.removeEdge(this);
		}
		this._vertexB = b;
		if(this._vertexB){
			this._vertexB.addEdge(this);
		}
	}
	return this._vertexB;
}
Graph.Edge.prototype.opposite = function(v){
	if(this.A()==v){
		return this.B();
	}else if(this.B()==v){
		return this.A();
	}
	return null;
}
Graph.Edge.prototype.toString = function(){
	return "[Edge "+this._id+" ("+(this._vertexA ? ("("+this._vertexA.id()+")") : "(?)")+"-"+this._weight+"->"+(this._vertexB ? ("("+this._vertexB.id()+")") : "(?)")+"]";
}
// ------------------------------------------------------------------------------------------------------------------------
