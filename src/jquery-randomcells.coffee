( ($) ->
	$.fn.randomCells = (options)->
		settings = $.extend {
				'max'			: 3, 			# number of displayed elements
				'delay'			: 1000,			# delay	
				'selector'		: 'li',			# list item selector
				'src'			: '#rc-data',	# data selector
				'mode'			: 'swap',		# 'spread' (all) / 'swap' (single)
				'swapMode'		: 'ordered',	# 'random' / 'ordered'
				'hideTime'		: 200,			# item hide animation time
				'hideClass'		: 'rc-hide',	# class added on hide animation
				'showTime'		: 200,			# item show animation time
				'showClass'		: 'rc-show',	# class added on show animation
				'visibleClass'	: 'rc-active',	# class added when item is visible
				'dev'			: false			# is developer envoirment? (trace msgs)
			}, options
		delay = settings.delay
		if settings.mode == 'spread'
			delay += settings.hideTime + settings.showTime
		$wrapper = this		
		selector = settings.selector
		src = settings.src
		elements = []
		isPlaying = false
		swapIndex = 1
		# if $wrapper.data("selector")
		# 	selector = $wrapper.data("selector")
		# if $wrapper.data("src")
		# 	src = $wrapper.data("src")
		
		# console.info if dev = true #
		trace = (str)->
			if settings.dev
				console.info(str)

		# check if number of src elements < max #
		validate = ()->
			myMax = settings.max
			myRequired = elements.length - 1
			if settings.mode == 'spread'
				myMax = settings.max * 2
				myRequired = Math.floor(elements.length / 2)
			if elements.length < myMax
				trace ":validate: settings.max was updated! Source list was shorter then required"
				settings.max = myRequired

		# read src #
		readSrc = ()->
			i = 0
			$(src).find(selector).each ()->
				i++
				$(@).data("rc-id", i)
				
				elements.push($(@))
			validate()
			trace ":readSrc: data elements number: " + elements.length			
		
		# get random element from src #
		getRandomElement = (set = [])->
			$item = elements[Math.floor(Math.random() * elements.length)]
			id = $item.data "rc-id"
			if $.inArray(id, set) >= 0
				return getRandomElement(set)
			# clone with data (true) and unbind events (off)
			return $item.clone(true).off()
		
		# get random item from inside the wrapper #
		getRandomItem = ()->
			$list = $wrapper.find(selector)
			if $list.length > 0
				num = Math.floor(Math.random() * $list.length + 1)
				return $wrapper.find(selector + ':nth-child(' + num + ')')
			return false
		
		# get next swap item by swapIndex #
		getNextSwapItem = ()->
			$it = $wrapper.find(selector + ':nth-child(' + swapIndex + ')')
			swapIndex++
			if swapIndex > $wrapper.find(selector).length
				swapIndex = 1
			return $it

		# hide element class + timeout #
		hideItem = ($it)->			
			$it.addClass settings.hideClass	
			$it.removeClass settings.visibleClass	
			$it.timeout = setTimeout ()->
				$it.removeClass settings.hideClass				
				$it.remove()	
			, settings.hideTime
		
		# show element class + timeout #
		showItem = ($it, delay = 0)->			
			$it.timeout = setTimeout ()->
				$wrapper.prepend($it)
				$it.addClass settings.showClass
				$it.addClass settings.visibleClass
				$it.timeout = setTimeout ()->
					$it.removeClass settings.showClass
				, settings.showTime
			, delay

		# swap element #
		swapItem = ($it, $el)->
			$it.addClass settings.hideClass	
			$it.removeClass settings.visibleClass
			$it.timeout = setTimeout ()->
				$it.removeClass settings.hideClass
				$it.data("rc-id", $el.data("rc-id"))
				$it.html($el.html())
				$it.addClass settings.showClass
				$it.addClass settings.visibleClass
				$it.timeout = setTimeout ()->
					$it.removeClass settings.showClass
				, settings.showTime

			, settings.hideTime


		# get current set #
		getCurrentSet = ()->
			set = []
			$wrapper.find(selector).each ()->
				set.push($(@).data("rc-id"))
			return set


		# spread #
		spread = ()->
			trace ":spread:"
			set = getCurrentSet()
			showDelay = 0
			$wrapper.find(selector).each ()->				
				hideItem($(@))
				showDelay = settings.hideTime
			i = 0
			while i < settings.max
				i++
				$el = getRandomElement(set)
				set.push($el.data("rc-id"))
				showItem($el, showDelay)
		# swap #
		swap = ()->
			trace ":swap:"
			set = getCurrentSet()
			if settings.swapMode == 'random'
				swapItem(getRandomItem(), getRandomElement(set))
			else
				swapItem(getNextSwapItem(), getRandomElement(set))

		startInterval = ()->
			if settings.mode == 'spread' 
				func = spread
			else func = swap			
			$wrapper.timer = setInterval func, delay			
			isPlaying = true
		stopInterval = ()->
			clearInterval($wrapper.timer)
			isPlaying = false
		# public pause #
		$.fn.randomCells.pause = ()->
			stopInterval()
		# public play #
		$.fn.randomCells.play = ()->
			startInterval()
		# toggle play/pause #
		$.fn.randomCells.togglePause = ()->
			if isPlaying
				stopInterval()
			else 
				startInterval()

		# init #
		init = ()->
			readSrc()
			spread()
			startInterval()

		init()
) jQuery