mongo.directive('switchClass', ['$route', function($route) {
  return {
    link: function (scope, element, attrs, controller) {
    	scope.$on('$locationChangeSuccess', function(event, newLoc, oldLoc){
    		var index = newLoc.indexOf("#/");  		
    		if(index < 0)
    			return;
            var view = newLoc.substr(index);
            element.find('li').removeClass('active');
            element.find('li').each(function(){
            	var ele = $(this);
            	if(view === ele.find('a').attr('href')){
            		ele.addClass("active");
            	}
            });
    	});
      
      }
    }
  }]
);

mongo.directive('switchFooter', ['$route', function($route) {
  return {
    link: function (scope, element, attrs, controller) {
    	scope.$on('$locationChangeSuccess', function(event, newLoc, oldLoc){
    		var index = newLoc.indexOf("#/");  		
    		if(index < 0)
    			return;
            var view = newLoc.substr(index);
            var footer = $('.panel-footer').find('span');
            if(footer.length === 0){
            	$('.panel-footer').append("<span></span>");
            	footer = $('.panel-footer').find('span');
            }
            footer.removeClass();
            if(view === "#/"){
            	footer.addClass('glyphicon glyphicon-list');
            }else if(view === "#/add"){
                footer.addClass('glyphicon glyphicon-plus');
            }else if(view.indexOf("#/update/") > -1){
                footer.addClass('glyphicon glyphicon-wrench');
            }
    	});
      
      }
    }
  }]
);