/**
 topological sort for node layout

 USAGE:

 define(['toposort.js'],function(toposort){
	G={
	'c':new Set(['b','a']),
	'd':new Set(['b','c']),
	'e':new Set(['d']),
	'f':new Set(['a'])
	}	
	result=toposort(G)

	/**result:
	[['a','b'],['c','f'],['d'],['e']]
 */
define([],function(){

	function set_diff(A,B) {
		// computes set difference A - B 
		return new Set(Array.from(A).filter(function(x){return !B.has(x)}))
	}

	var toposort=function(G){

		var keys=Object.keys(G)
		// special case: empty graph
		if (keys.length == 0)
			return []
		
		G = Object.assign({}, G);


		// ignore self dependencies
		for (var key in G) {
			G[key]=new Set(Array.from(G[key]).filter(function(x){return x != key}))
		} 

		// compute union of all dependencies,
		var deps = new Set()
		for (var key in G) {
			deps = new Set([...deps, ...G[key]])
		}
		// subtract keys from dependents
		// we are left with non-key nodes that don't depend on anything
		// (since not in keys)
		var extra_items_in_deps = set_diff(deps,new Set(keys))

		extra_items_in_deps.forEach(function(key){
			G[key]=new Set()
		})

		// loop over graph, yield nodes that have 
		// no dependencies and remove them from dependencies of other nodes.
		var sorted = []
		while (true) {
			var tmp = []
			
			var no_deps = new Set(Object.keys(G).filter(function(key){
				return Array.from(G[key]).length == 0
			}))

			if (no_deps.size == 0) {
				break
			}

			sorted.push(no_deps)

			// remove no_deps from dependencies of all nodes 
			// except those that are already in no_deps
			G2 = {}
			for (var key in G) {
				if (!no_deps.has(key))
				{
					G2[key] = set_diff(G[key],no_deps)
				}
			}
			G=G2
		}
		if (Object.keys(G).length!=0)
		{
			throw 'Graph is acyclic; cannot topologically sort'				
		}
		return sorted
	}
	return toposort
})