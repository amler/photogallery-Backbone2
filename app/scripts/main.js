'use strict';

/////////////////////////////
// Model
/////////////////////////////

var Snapshot = Backbone.Model.extend({
	idAtrribute: '_id'
});

/////////////////////////////
// Collection
/////////////////////////////

var PicsCollection = Backbone.Collection.extend({
	model: Snapshot,
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
		"click" : "showDetailView"
	},

	// 90% of the time will be a render function
	initialize: function() {
		// telling the view to keep track of events
		//this.listenTo(PicsCollection, 'change', this.render);
		//adding to the empty div on the DOM container
		$('.thumbnail-container').append(this.el);
		// calling the method in this object render
		this.render();
	},

	render: function(){
		var renderedTemplate = this.template(this.model.attributes)
		this.$el.html(renderedTemplate);
	},

	showDetailView: function(){
    	var detail = new DetailView({model: this.model})
    	detail.render()
 	}
});

/////////////////////////////
// Detail View
/////////////////////////////

var DetailView = Backbone.View.extend({

	template: _.template($('.image-detail-display-template').text()),
	editTemplate: _.template($('.image-edit-detail-template').text()),

	events: {
		'click .edit' : 'editImage',
		'click .save' : 'saveImage'
	},

	initialize: function() {
		{this._modelBinder = new Backbone.ModelBinder();}

		this.listenTo(this.model, 'change', this.render);
		$('.image-detail').append(this.el);
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template(this.model.attributes)
		this.$el.html(renderedTemplate);
	},

	editImage: function(){
		var renderedTemplate = this.editTemplate(this.model.attributes)
		this.$el.html(renderedTemplate);
	},

	saveImage: function(){
		var urlValue = this.$el.find('.urlvalue').val();
		var captionValue = this.$el.find('.captionvalue').val();
		this.model.set('url', urlValue);
		this.model.set('caption', captionValue);
		this.model.save()
	}
})


/////////////////////////////
// Instances
/////////////////////////////

var picGallery = new PicsCollection();

picGallery.fetch().done(function(){
	picGallery.each(function (image){
		new ThumbnailView({model: image});
	});
});
