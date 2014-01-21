{"version":3,"file":"build/entropy.min.js","sources":["build/entropy.js"],"names":["global","isString","val","String","app","VERSION","Entropy","getVersion","Easing","Linear","In","t","b","c","d","Quadratic","Out","InOut","Cubic","Quartic","Quintic","Sine","Math","cos","PI","sin","Exponential","pow","Circular","sqrt","Engine","game","_can_modify","this","_greatest_e_id","_e_ids_to_reuse","_entities","_current_e_id","_entities_count","_components_index","_components_pool","_components_pool_size","_entities_pool","_entities_pool_size","_systems","OrderedLinkedList","_updating","_families","none","Family","_entity_family_index","_entities_to_remove","_blank_family","i","_next_c_id","_component_manifest","_system_manifest","_entity_pattern","component","name","Game","error","system","entity","family","pattern","families","split","prototype","getComponentPattern","getNewComponent","id","length","new_component","pop","deleted","addComponentToPool","obj","push","setComponentsIndex","e_id","c_id","unsetComponentsIndex","createComponentsIndex","obtainEntityId","canModify","create","max","f","args","Array","slice","call","arguments","unshift","hasOwnProperty","e","Entity","setId","apply","append","remove","removeAllComponents","removeAllEntities","markForRemoval","getEntity","getEntitiesWith","c_array","max1","max2","found","e_matched","map","getAllEntities","getFamily","addSystem","priority","engine","init","insert","removeSystem","isUpdating","removeAllSystems","clear","isSystemActive","node","head","data","next","update","delta","event","afterUpdate","getComponentPoolSize","_component_pool_size","components","recycled","states","default","onEnter","onExit","current_state","p","add","lowercase_name","toLowerCase","component_pattern","soft_delete","setRecycled","addState","warning","state","Node","break_iteration","getComponents","findPrecedingNode","obolete_node","iterate","fn","binding","breakIteration","one","starting_state","input","ticker","addListener","changeState","_consts","_states","dummy","onReturn","_current_state","_entered_states","_e_patterns","state_obj","entityPattern","log","message","console","Error","join","warn","constans","value","toUpperCase","Object","defineProperty","setRenderer","renderer","setStage","stage","createEntity","start","pause","resume","Input","_pressed_keys","window","addEventListener","keyCode","_keys","BACKSPACE","TAB","ENTER","SHIFT","CTRL","ALT","PAUSE_BREAK","CAPS_LOCK ","ESCAPE","SPACE","PAGE_UP","PAGE_DOWN","END","HOME","LEFT_ARROW","UP_ARROW","RIGHT_ARROW","DOWN_ARROW","INSERT","DELETE","0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","LEFT_WINDOW_KEY","RIGHT_WINDOW_KEY","SELECT_KEY","NUMPAD_0","NUMPAD_1","NUMPAD_2","NUMPAD_3","NUMPAD_4","NUMPAD_5","NUMPAD_6","NUMPAD_7","NUMPAD_8","NUMPAD_9","MULTIPLY","ADD","SUBTRACT","DECIMAL_POINT","DIVIDE","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","NUM_LOCK","SCROLL_LOCK","SEMI_COLON","EQUAL_SIGN","COMMA","DASH","PERIOD","FORWARD_SLASH","GRAVE_ACCENT","OPEN_BRACKET","BACK_SLASH","CLOSE_BRACKET","SINGLE_QUOTE","_mouse_position","x","y","isPressed","getPressedKeys","keys","setMouseStagePosition","position","getMouseStagePosition","tail","current","lastTime","vendors","requestAnimationFrame","cancelAnimationFrame","callback","currTime","Date","getTime","timeToCall","setTimeout","clearTimeout","performance","now","nowOffset","timing","navigationStart","Ticker","tick","time","raf","_paused","is_running","last_time_value","MAX_FRAME_TIME","FPS","ticks","_ticks","paused","len","callbacks","_raf_id","setFPS","fps","getFPS","getTicks","that","degToRad","degrees","radToDeg","radians","Vector","coords","toString","updatePolarCoords","angle","rotate","updateCartCoords","v","return_new","rotateRad","vector","scale","scalar","setAngle","getRadAngle","truncate","desiredLength","normalize","substract","dot","reverseX","reverseY","reverseBoth","minAngleTo","negate","clone","atan2","debug"],"mappings":"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"}