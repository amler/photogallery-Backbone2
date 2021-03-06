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
/*
	events: {
	// by default click = this.el
		'click' : 'showDetailView'
	},*/

	// 90% of the time will be a render function
	initialize: function() {
		// telling the view to keep track of events - render is a reference since this function is calling render. Any changes made to the model from another view 
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
/*
	showDetailView: function(){
		// Since in the instance we assigned the first model object to this view
		detailInstance.remove()
		// This view telling the other model that it has a model and hands over.
		// GLOBAL variable
    	detailInstance = new DetailView({model: this.model})	
 	}*/
});

/////////////////////////////
// Detail View
/////////////////////////////

var DetailView = Backbone.View.extend({

	template: _.template($('.image-detail-display-template').text()),
	editTemplate: _.template($('.image-edit-detail-template').text()),
	//newTemplate: _.template($('.image-add-detail-template').text()),

	events: {
		'click .edit'	: 'editImage',
		'click .save' 	: 'saveImage',
		'click .delete' : 'destroy',
		'click .new' 	: 'createImage'
	},

	initialize: function() {
		// telling this view to reredner any changes to the model
		this.listenTo(picGallery, 'add', function(pic) {
			new ThumbnailView({model: pic})
		})
		// this.model.on('change', this.render)
		// tells the view to rerender itself when the model is changed (aka edit)
		this.listenTo(this.model, 'add', this.render);
		this.listenTo(this.model, 'change', this.render);
		// targeting that class
		$('.image-detail').prepend(this.el);
		this.render();
	},

	render: function() {
		var renderedTemplate = this.template(this.model.attributes)
		//console.log(this.model.attributes)
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
		//console.log('saving')
		var urlValue = this.$el.find('.urlvalue').val()
		// console.log(urlValue)
		var captionValue = this.$el.find('.captionvalue').val()
		//console.log(captionValue)

		if (captionValue == 0 && urlValue == 0) {
			alert("Please enter in a url and caption");
			return;
		}

		console.log('about to set')
		this.model.set({
			url: urlValue,
			caption: captionValue
		});

		// adding to the collection from the createImage click and then saving
		//picGallery.add(this.model);
		this.model.save();
		
	},

	createImage: function() {
		var newPic = new Pic();
		this.model = newPic
		// simplest way to clear the current model rendered in the detail view 
			//both imputs are cleared
		this.$el.find('input').val('');
		
			// changes the img tag attribute with a placeholder
	    this.$el.find('img').attr('src','http://fc09.deviantart.net/fs70/f/2010/070/b/e/Insert_Title_Here_by_Psychokill.png');
	},

	destroy: function() {
		// console.log(this.model);
		// 	debugger
		var sureDelete = confirm("Are you sure you to delete this?");
		if (sureDelete === true) {
			this.model.destroy();
			this.remove();

			/// rerenders after destroying - I don't feel good about this - shouldn't this this.render work?
			detailInstance = new DetailView({model: picGallery.first()})

		}
	}
});

/////////////////////////////
// Router
/////////////////////////////
var detailInstance = null;

var appRouter = Backbone.Router.extend({
	routes: {
		"" : "renderHome",
		"photos/:id" : "renderDetail",
		/*"users/:username"           : "renderUser",
		"users/:username/favorites" : "renderUserFavorites"*/
	},

	initialize: function () {
		picGallery.fetch().done(function() {
			picGallery.each(function (image) {
				new ThumbnailView({model: image});
			});
		});
	},

	renderHome: function () {
		$('.swear').html('bullshit.');
		if (detailInstance != null) {
			detailInstance.remove();
		}
	},

	renderDetail: function(id) {
		console.log('I clicked a thing!')
		//picGallery.get(id);
		console.log(id);
		if (detailInstance != null) {
			detailInstance.remove();
		}
		detailInstance = new DetailView({model: picGallery.get(id)})
	}
});


/////////////////////////////
// Instances
/////////////////////////////

// instantiating the collection constructor
var picGallery = new PicsCollection();
// setting as a global

var router = new appRouter();
Backbone.history.start();

