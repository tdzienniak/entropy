class Node
    constructor: (data) ->
        @prev = null
        @next = null
        @data = data ? null


class DoublyLinkedList
    constructor: ->
        @head = @tail = null
        @_current = @head

    append: (data) ->
        if not data?
            return

        node = new Node data

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

        node = new Node data

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
        do @reset

        while node = @next()
            if byData and thing is node.data or not byData and thing is node
                nodeToRemove = node
                break

        if nodeToRemove?
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

    pop: () ->

    shift: () ->

    begin: () ->
        @_current = @head

        return @

    end: () ->
        @_current = @tail

        return @

    next: () ->
        temp = @_current
        @_current = @_current?.next

        return temp

    prev: () ->
        temp = @_current
        @_current = @_current?.prev

        return temp

    current: () -> @_current

    iterate: (fn, binding, args...) ->
        do @reset

        while node = @next()
            fn.apply(binding, [node, node.data].concat(args))

        return @

    reset: (end=false) ->
        @_current = if not end then @head else @tail

        return @

    clear: ->
        @head = @tail = null

        return @



module.exports = DoublyLinkedList