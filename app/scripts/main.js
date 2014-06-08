'use strict';

/////////////////////////////
// Model
/////////////////////////////
var Pic = Backbone.Model.extend({
	defaults: {
		caption: '',
		url: '',
	},

	idAttribute: '_id'
});

/////////////////////////////
// Collection
/////////////////////////////
var PicsCollection = Backbone.Collection.extend({
	model: Pic,
	url: 'http://tiny-pizza-server.herokuapp.com/collections/scamler-photos' 
});

/////////////////////////////
// Thumbnail View
/////////////////////////////
var ThumbnailView = Backbone.View.extend({
	// assigning a classname to this.el aka div by default
	className: 'thumbnails',

	template: _.template($('.thumbnail-template').text()),

	events: {
	// by default click = this.el
		'click' : 'showDetailView'
	},

	// 90% of the time will be a render function
	initialize: function() {
		// telling the view to keep track of events - render is a reference since this function is calling
		this.listenTo(this.model, 'change', this.render);
		//adding to the empty div on the DOM container
		$('.thumbnail-container').append(this.el);
		// calling the method in this object render
		this.render();
	},

	render: function(){
		var renderedTemplate = this.template(this.model.attributes);
		this.$el.html(renderedTemplate);
	},

	showDetailView: function(){
		// Since in the instance we assigned the first model object to this view
		detailInstance.remove()
		// This view telling the other model that it has a model and hands over.
		// GLOBAL variable
    	detailInstance = new DetailView({model: this.model})	
 	}
});

/////////////////////////////
// Detail View
/////////////////////////////
var globalTest;
var DetailView = Backbone.View.extend({

	template: _.template($('.image-detail-display-template').text()),
	editTemplate: _.template($('.image-edit-detail-template').text()),
	//newTemplate: _.template($('.image-add-detail-template').text()),

	events: {
		'click .edit' : 'editImage',
		'click .save' : 'saveImage',
		'click .new' : 'createImage'
	},

	initialize: function() {
		// telling view to listen for new additions
		this.listenTo(picGallery, 'add', function(pic) {

			new ThumbnailView({model: pic});
		});
		// telling this view to reredner any changes to the model
		this.listenTo(this.model, 'change', this.render);
		// targeting that class
		$('.image-detail').append(this.el);
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template(this.model.attributes)
		this.$el.html(renderedTemplate);
		// Idea with render is that you should generally return this.
		// The reason is that you can keep chaining stuf onto render
		return this;
	},

	editImage: function(){
		var renderedTemplate = this.editTemplate(this.model.attributes)
		this.$el.html(renderedTemplate);
		return this;
	},

	saveImage: function(){
		
		this.model.set({
			url: this.$el.find('.urlvalue').val(),
			caption: this.$el.find('.captionvalue').val()
		});
		
		// adding to the collection from the createImage click and then saving
		picGallery.add(this.model)

		this.model.save();
		//console.log(this.model);

	},

	createImage: function() {
		var newPic = new Pic();
		this.model = newPic
		this.$el.find('.urlvalue').val('');
		this.$el.find('.captionvalue').val('');
	    this.$el.find('img').attr('src','http://fc09.deviantart.net/fs70/f/2010/070/b/e/Insert_Title_Here_by_Psychokill.png');
	}
});

/////////////////////////////
// Instances
/////////////////////////////

// instantiating the collection constructor
var picGallery = new PicsCollection();
// setting as a global
var detailInstance;

picGallery.fetch().done(function(){
	picGallery.each(function (image){
		new ThumbnailView({model: image});
	});
	// creating the new view by passing it the first model object
	detailInstance = new DetailView({model: picGallery.first()})
});
