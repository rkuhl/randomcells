( ($) ->
	$.fn.randomCells = (options)->
		settings = $.extend {
				'max'			: 3 			# number of displayed elements
				'delay'			: 500,			# delay
				'selector'		: 'li'			# list item selector
				'src'			: '#rc-data'	# data selector
			}, options
		$wrapper = this
		selector = settings.selector
		src = settings.src
		elements = []
		# if $wrapper.data("selector")
		# 	selector = $wrapper.data("selector")
		# if $wrapper.data("src")
		# 	src = $wrapper.data("src")
		
		readSrc = ()->
			$(src).find(selector).each ()->
				elements.push($(@))
		spread = ()->
			console.info "spread!"
		init = ()->
			readSrc()
			spread()

		init()
) jQuery