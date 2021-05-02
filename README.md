# K means clustering visualization


https://user-images.githubusercontent.com/29355962/116796469-d8c6e900-ab06-11eb-9920-cf0d086f51ba.mp4


[Demo](http://vanviethieuanh.com/k-means-clustering/)

Created using [Svelte](http://svelte.dev/) and [Florence](https://florence.spatialnetworkslab.org/) 

> k-means clustering is a method of vector quantization, originally from signal processing, that aims to partition n observations into k clusters in which each observation belongs to the cluster with the nearest mean (cluster centers or cluster centroid), serving as a prototype of the cluster. This results in a partitioning of the data space into Voronoi cells. k-means clustering minimizes within-cluster variances (squared Euclidean distances), but not regular Euclidean distances, which would be the more difficult Weber problem: the mean optimizes squared errors, whereas only the geometric median minimizes Euclidean distances. For instance, better Euclidean solutions can be found using k-medians and k-medoids.
> 
> [Wikipedia](https://en.wikipedia.org/wiki/K-means_clustering)
> 

### Command
==============K-MEANS CLUSTERING==============

**help**

Show this help

**assign**

Assign each observation to the cluster with the nearest mean.

**update**

Recalculate means (centroids) for observations assigned to each cluster.

**fit**

Repeat assign and update until the assignments no longer change.

**set --help**

To show how to set variables

**reset**

Shuffle data again, it will recreate centers of data and random change position of labels

**git be email web**

Show about me

**clear history**

Same with terminal

### Set
**set label n**

Set the amount of label (2≤n≤9)

**set data n**

Set the amount data for each label (n ≥ 10 , should be < 100 for better visualize)


**set error n**

Set the error range for data from center point (5≤n≤50)
