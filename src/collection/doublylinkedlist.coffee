class Node
    constructor: (data) ->
        @prev = null
        @next = null
        @data = data ? null


class DoublyLinkedList
    constructor: ->
        @head = @tail = null
        @_current = @head
        @_pool = null

    _getNewNode: (data) ->
        if @_pool?
            node = @_pool

            @_pool = node.next
            node.next = node.prev = null
            node.data = data

            if @_pool?
                @_pool.prev = null

            return node
        else 
            return new Node data
    append: (data) ->
        if not data?
            return

        node = @_getNewNode data

        # first node case
        if not @head?
            @tail = @head = node

            return @

        # any next node case
        @tail.next = node
        node.prev = @tail
        @tail = node

        return @

    prepend: (data) ->
        if not data?
            return

        node = @_getNewNode data

        # first node case
        if not @head?
            @tail = @head = node

            return @

        # any next node case
        @head.prev = node
        node.next = @head
        @head = node

        return @

    join: (list, prepend=false) ->
        if not list instanceof DoublyLinkedList
            console.warn 'DoublyLinkedList.join argument must be type of DoublyLinkedList'
            return @

        if not list.head?
            return @

        if not @head?
            @head = list.head
            @tail = list.tail

            return @

        if prepend
            list.tail.next = @head
            @head.prev = list.tail
            @head = list.head
            list.tail = @tail
        else
            list.head.prev = @tail
            @tail.next = list.head
            @tail = list.tail
            list.head = @head

        return @

    remove: (thing, byData=false) ->
        if byData
            do @reset

            while node = @next()
                if thing is node.data
                    nodeToRemove = node
                    break
        else
            nodeToRemove = thing

        if nodeToRemove?
            #node is the only one in the list
            if not nodeToRemove.next? and not nodeToRemove.prev?
                @head = @tail = null
            else if nodeToRemove is @head
                nodeToRemove.next?.prev = null
                @head = nodeToRemove.next
            else if nodeToRemove is @tail
                nodeToRemove.prev?.next = null
                @tail = nodeToRemove.prev
            else
                nodeToRemove.next?.prev = nodeToRemove.prev
                nodeToRemove.prev?.next = nodeToRemove.next

        return @

    pop: ->

    shift: ->

    push: (data) ->
        @append data

    unshift: (data) ->
        @prepend data

    one: ->
        return @head?.data

    begin: ->
        @_current = @head

        return @

    end: ->
        @_current = @tail

        return @

    next: ->
        temp = @_current
        @_current = @_current?.next

        return temp

    prev: ->
        temp = @_current
        @_current = @_current?.prev

        return temp

    current: -> @_current

    iterate: (fn, binding, args...) ->
        do @reset

        while node = @next()
            fn.apply(binding, [node, node.data, node.data?.components].concat(args))

        return @

    reset: (end=false) ->
        @_current = if not end then @head else @tail

        return @

    clear: ->
        if @tail?
            @tail.next = @_pool
            @_pool = @head

        @head = @tail = null
        @_current = null

        return @



module.exports = DoublyLinkedList