// Capture form entry for search keywords then naviaget to search form
// initiating the first search.

function DeepSearchController ($scope, $location, QueryStore) {
	
	$scope.search = function() {
		QueryStore.storeQuery($scope.keywords);
		$location.path('/deep-search');
	};
}

// Facet-Browser library

// A model for querying RDF data using SPARQL Property Paths as facets (in the library science sense). 

// A Facet Browser Controller corresponds to a search session.
// It adds a collection of facets, and some search results to the scope.

DeepSearchController.$inject = ['$scope', '$location', 'QueryStore'];

		function FacetBrowserController($scope, $http, QueryStore) {

			pageIndex = 0;
			$scope.noOfPages = 5;
			$scope.currentPage = pageIndex + 1;
			$scope.maxSize = 5;

			$scope.turnPage = function (pageNo) {
				pageIndex = pageNo - 1;
				$scope.peopleByFamilyName();
			};	  

			var facets = {};
			$scope.changed = false;
			$scope.facets = facets;
			$scope.modelUpdated = function() {
				$scope.changed = true;
			}
			//var textSearchParameter = parseUri(window.location).queryKey.text
			var textSearchParameter = QueryStore.fetchQuery();
			
			$scope.textValue = textSearchParameter;
			$scope.itemQuery = "";
			$scope.graphQueryURI = "";
			
			var hits = new Array();
			$scope.hits = hits;
			
			$scope.refresh = function() {
			
				// record the currently selected values of each facet as the constraints of each facet
				for (var facetName in $scope.facets) {
					var facet = $scope.facets[facetName];
					facet.constraints.length = 0;
					for (var v = 0; v < facet.values.length; v++) {
						// add this value as a constraint on this facet, if the value is selected
						var facetValue = facet.values[v];
						if (facetValue.selected) {
							facet.constraints.push(facetValue.value);
						}
					}
				}
				// now we have got the constraints, we can execute the queries
				$scope.executeQuery();
			}				

			$scope.executeQuery = function() {
				// SPARQL service details
				var sparqlEndpoint = "http://corbicula.huni.net.au/dataset/query";
				// Specify media types for the SPARQL query and the query results
				var config = {
					"headers": {
						"Accept": "application/sparql-results+json",
						"Content-Type": "application/sparql-query"
					}
				};

				// compute and execute queries
				var freeTextCriterion = "";
				var textValue = $scope.textValue;
				if ($scope.textValue) {
					freeTextCriterion = "{?item (<http://xmlns.com/foaf/0.1/name>|<http://xmlns.com/foaf/0.1/firstName>|<http://xmlns.com/foaf/0.1/lastName>|<http://www.w3.org/2004/02/skos/core#prefLabel>) ?textValue. "
					freeTextCriterion = freeTextCriterion + "FILTER(REGEX(?textValue, '" + textValue + "', 'i'))}";
				}

				// compute facet constraints
				var facetConstraints = "";
				for (var facetName in $scope.facets) {
					// set any constraints on this facet
					var facet = $scope.facets[facetName];
					// keep track of whether we've constrained the facet yet
					var facetConstrained = false;
					for (var c = 0; c < facet.constraints.length; c++) {
						var constraint = facet.constraints[c];
						if (facetConstrained) {
							// facet already had a constraint, so we have to expand it to include this one
							facetConstraints = facetConstraints + " UNION ";
						}
						facetConstraints = facetConstraints + "{?item " + facet.propertyPath + " " + constraint + "}";
						facetConstrained = true;
					}
				}
				
				// results for list of hits
				var itemQuery = "SELECT distinct(?item as ?hit) ?name WHERE {";
				itemQuery = itemQuery + facetConstraints;
				if (textValue != "") {
					itemQuery = itemQuery + freeTextCriterion;
				}				
				itemQuery = itemQuery + " optional {?item <http://xmlns.com/foaf/0.1/lastName> ?name}}";
				$scope.itemQuery = itemQuery;
				$scope.itemQueryURI = "http://corbicula.huni.net.au/dataset/query?output=xml&stylesheet=%2Fxslt%2Fxml-to-html.xsl&query=" + encodeURIComponent(itemQuery);
				$http.post(sparqlEndpoint, $scope.itemQuery, config).
					success(
						function(data, status, headers, config) {
							// this callback will be called asynchronously
							// when the response is available
							$scope.itemQueryResponse = data.results.bindings;
							var hits = new Array();
							for (var i = 0; i < data.results.bindings.length; i++) {
									var binding = data.results.bindings[i];
									//alert(binding.hit.value);
									var name = binding.name;
									var label = "(unnamed)";
									if (binding.name) {
										label = binding.name.value;
									}
									hits.push(new Hit(binding.hit.value, label));
							}
							$scope.hits = hits;
						}			
					).
					error(
						function(data, status, headers, config) {
							// called asynchronously if an error occurs
							// or server returns response with an error status.
							///alert('Error reading results from server. Status: ' + status);
						}
				);
				// results for RDF graph
				var graphQuery = "PREFIX ore: <http://www.openarchives.org/ore/terms/>\n";
				graphQuery = graphQuery + "CONSTRUCT {\n";
				graphQuery = graphQuery + "   <#resourceMap> a ore:ResourceMap.\n";
				graphQuery = graphQuery + "   <#resourceMap> ore:describes <#aggregation>.\n";
				graphQuery = graphQuery + "   <#aggregation> a ore:Aggregation.\n";
				graphQuery = graphQuery + "   <#aggregation> ore:aggregates ?item\n";
				graphQuery = graphQuery + "} WHERE {\n";
				graphQuery = graphQuery + facetConstraints;
				if (textValue != "") {
					graphQuery = graphQuery + freeTextCriterion;
				}
				graphQuery = graphQuery + "\n}"
				$scope.graphQueryURI = "http://corbicula.huni.net.au/dataset/query?output=xml&query=" + encodeURIComponent(graphQuery);
				
				var facetValuesQuery = "SELECT ?facetName ?facetValue ?facetValueLabel (COUNT(DISTINCT(?item)) AS ?facetValueCount)\nWHERE {\n";

				if (textValue != "") {
					facetValuesQuery = facetValuesQuery + freeTextCriterion;
				}
				
				var hasPrecedingFacet = false; // the first facet has no preceding facet
				for (var facetName in $scope.facets) {
					// select values of this facet which match the constraints of the other facets
					var facet = $scope.facets[facetName];
					if (hasPrecedingFacet) {
						facetValuesQuery = facetValuesQuery + "\tUNION\n";
					}
					hasPrecedingFacet = true;
					facetValuesQuery = facetValuesQuery + "\t{\n\t\tBIND('" + facet.name + "' as ?facetName)\n";
					facetValuesQuery = facetValuesQuery + "\t\t?item " + facet.propertyPath  + " ?facetValue.\n";
					// constrain values by the other facet selections
					//facetValuesQuery = facetValuesQuery + "{"; 
					var facetCounter = 0;
					for (var otherFacetName in $scope.facets) {
						if (otherFacetName != facetName) {
							otherFacet = $scope.facets[otherFacetName];
							if (otherFacet.constraints.length > 0) {
								facetCounter = facetCounter + 1;
								// the value counts for a facet are computed based on the selected constraints of all OTHER facets, excluding the facet itself
								facetValuesQuery = facetValuesQuery + "\t\t?item " + otherFacet.propertyPath + " ?facet" + facetCounter + "Value.\n\t\tFILTER(?facet" + facetCounter + "Value IN (\n\t\t\t";
								var facetConstrained = false;
								for (var c = 0; c < otherFacet.constraints.length; c++) {
									var constraint = otherFacet.constraints[c];
									if (facetConstrained) {
										// adding a constraint to a non-null list of constraints, so need a comma
										facetValuesQuery = facetValuesQuery + ",\n\t\t\t";
									}
									facetValuesQuery = facetValuesQuery + constraint;
									facetConstrained = true;
								}
								facetValuesQuery = facetValuesQuery + "\n\t\t))\n";
							}
						}
					}
					facetValuesQuery = facetValuesQuery + "\t}\n";
				}
				// QAZ assumptions about appropriate facet value labels
				facetValuesQuery = facetValuesQuery + "\tOPTIONAL {?facetValue <http://www.w3.org/2004/02/skos/core#prefLabel> ?facetValueLabel}\n";
				facetValuesQuery = facetValuesQuery + "\tOPTIONAL {?facetValue <http://xmlns.com/foaf/0.1/name> ?facetValueLabel}\n";
				facetValuesQuery = facetValuesQuery + "}\n";
				facetValuesQuery = facetValuesQuery + "GROUP BY ?facetName ?facetValue ?facetValueLabel\n";
				facetValuesQuery = facetValuesQuery + "ORDER BY ?facetName DESC(?facetValueCount)";
				
				$scope.facetValuesQuery = facetValuesQuery;
				// update model properties. Make http request, parse results, repopulate facet model

				$http.post(sparqlEndpoint, $scope.facetValuesQuery, config).
					success(
						function(data, status, headers, config) {
							// this callback will be called asynchronously
							// when the response is available
							$scope.facetValuesQueryResponse = data.results.bindings;
							
							// rebuild the facet data model
							var currentFacet;
							// process the list of facet values
							for (var facetName in $scope.facets) {
								// discard the facet's old values
								var facet = $scope.facets[facetName];
								//var staleValuesCount = facet.values.length;
								//for (v = 0; v < staleValuesCount; v++) {
								//	facet.values.pop();
								//}
//								facet.values = new Array();
								facet.values.length = 0;
							}
							for (var i = 0; i < data.results.bindings.length; i++) {
								var binding = data.results.bindings[i];
								var facetName = binding.facetName.value;
								var facetValueValue;
								// convert facet value into a SPARQL expression
								if (binding.facetValue.type = "uri") {
									facetValueValue = "<" + binding.facetValue.value + ">";
								} else {
									// QAZ handle facet values which are not URIs
								}
								var facetValueLabel;
								if (binding.facetValueLabel) {
									facetValueLabel = binding.facetValueLabel.value; // QAZ handle non-string values or missing values
								} else {
									facetValueLabel = binding.facetValue.value;
								}
								var facetValueCount = binding.facetValueCount.value;
								
								currentFacet = $scope.facets[facetName];
								var facetValueSelected = false;
								for (v = 0; v < currentFacet.constraints.length; v++) {
									if (facetValueValue == currentFacet.constraints[v]) {
										facetValueSelected = true;
									}
								}
								var facetValue = new FacetValue(facetValueValue, facetValueLabel, facetValueCount, facetValueSelected);
								currentFacet.values.push(facetValue);
								
							}
						}
					).
					error(
						function(data, status, headers, config) {
							// called asynchronously if an error occurs
							// or server returns response with an error status.
							//alert('Error reading facets from server. Please try again.');
						}
					);
			};
			
			// add some example facets - replace with a SPARQL query
			var occupationFacet = new Facet("Occupation/Role",  "<http://erlangen-crm.org/current/P2_has_type>");
			var groupFacet = new Facet("Groups", "<http://erlangen-crm.org/current/P107i_is_current_or_former_member_of>");
			var typeFacet = new Facet("Type", "a");
			// QAZ how to specify a computed facet? e.g. the year of a person's birth, where the literal value of the object is a date
			//var birthYearFacet = new Facet("BIrth Year", "<http://erlangen-crm.org/current/P98i_was_born> <http://erlangen-crm.org/current/P4_has_time-span> <http://www.w3.org/1999/02/22-rdf-syntax-ns#value>");
			
			facets[occupationFacet.name] = occupationFacet;
			facets[groupFacet.name] = groupFacet;
			facets[typeFacet.name] = typeFacet;
			
			// set initial constraints
			//occupationFacet.constraints.push("<http://corbicula.huni.net.au/data/eoas/occupation/Information_technologist>");
			//occupationFacet.constraints.push("<http://corbicula.huni.net.au/data/eoas/occupation/Electrical_engineer>");
			
			//groupFacet.constraints.push("<http://corbicula.huni.net.au/data/eoas/A000219>");
			//groupFacet.constraints.push("<http://corbicula.huni.net.au/data/eoas/A000746>");

			typeFacet.constraints.push("<http://erlangen-crm.org/current/E21_Person>");
			
			$scope.executeQuery();
		};
		
		// A facet is a named SPARQL Property Path, along with a set of values, each value either selected or 
		// unselected, and each value with a count, representing the number of search hits which have that value.
		// A facet produces constraints for queries.
		// => search results query whose results all match the property path.
		// => browse values query whose results are all the possible values of the property path,
			// each with a count of the number of times each value occurs

		
		function Facet(name, propertyPath) {
			this.name = name;
			this.propertyPath = propertyPath;
			this.values = new Array();
			this.constraints = new Array();
		}
		
		function FacetValue(value, name, count, selected) {
			this.value = value;
			this.name = name;
			this.count = count;
			this.selected = selected;
		}
		
		function Hit(uri, label) {
			this.label = label;
			this.uri = uri;
		}

// parseUri 1.2.2
// (c) Steven Levithan <stevenlevithan.com>
// MIT License

function parseUri (str) {
	var	o   = parseUri.options,
		m   = o.parser[o.strictMode ? "strict" : "loose"].exec(str),
		uri = {},
		i   = 14;

	while (i--) uri[o.key[i]] = m[i] || "";

	uri[o.q.name] = {};
	uri[o.key[12]].replace(o.q.parser, function ($0, $1, $2) {
		if ($1) uri[o.q.name][$1] = $2;
	});

	return uri;
};

parseUri.options = {
	strictMode: false,
	key: ["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"],
	q:   {
		name:   "queryKey",
		parser: /(?:^|&)([^&=]*)=?([^&]*)/g
	},
	parser: {
		strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
		loose:  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
	}
};

