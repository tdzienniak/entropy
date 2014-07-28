class Node
    constructor: (data) ->
        @prev = null
        @next = null
        @data = data ? null


class DoublyLinkedList
    constructor: ->
        @head = @tail = null

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
            list.tail?.next = @head
            @head.prev = list.tail
            @head = list.head
            list.tail = @tail
        else
            list.head?.prev = @tail
            @tail.next = list.head
            @tail = list.tail
            list.head = @head

        return @

module.exports = DoublyLinkedList