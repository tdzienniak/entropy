class Node
    constructor: (data, priority) ->
        @next = null
        @priority = priority
        @data = data ? null


class OrderedLinkedList
    constructor: ->
        @head = @tail = null
        #@_current = @head

    insert: (data, priority) ->
        node = new Node(data, priority)

        if not @head?
            node.priority ?= 0
            @head = @tail = node

            return @

        node.priority ?= @tail.priority

        #list contains only one node (head === tail)
        if not @head.next?
            if @head.priority <= node.priority
                @head.next = @tail = node
            else
                node.next = @tail = @head
                @head = node

            return @

        #node priority is greater or equal tail priority
        #node should become tail
        if node.priority >= @tail.priority
            @tail = @tail.next = node

            return @

        #node priority is less than head priority
        #node should become head
        if node.priority < @head.priority
            node.next = @head
            @head = node

            return @

        #list has more than one node
        i = @head
        while i.next?
            if i.next.priority > node.priority
                node.next = i.next
                i.next = node

                break

            i = i.next

        return @


module.exports = OrderedLinkedList