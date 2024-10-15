export class MinHeap {
    constructor() {
        this.heap = [];
        this.length = 0;
    }

    parent(index) {
        return Math.floor((index - 1) / 2);
    }

    leftChild(index) {
        return 2 * index + 1;
    }

    rightChild(index) {
        return 2 * index + 2;
    }

    heapify(i) {
        let left_child = this.leftChild(i);
        let right_child = this.rightChild(i);
        let smallest = i;

        if (left_child < this.length && this.heap[left_child].priority < this.heap[smallest].priority) {
            smallest = left_child;
        }
        if (right_child < this.length && this.heap[right_child].priority < this.heap[smallest].priority) {
            smallest = right_child;
        }

        if (smallest !== i) {
            const temp = this.heap[smallest];
            this.heap[smallest] = this.heap[i];
            this.heap[i] = temp;
            this.heapify(smallest);
        }
    }

    push(priority, key) {
        this.heap.push({ priority: priority, key: key });
        this.length++;
        let i = this.length - 1;

        while (i !== 0 && this.heap[this.parent(i)].priority > this.heap[i].priority) {
            const temp = this.heap[i];
            this.heap[i] = this.heap[this.parent(i)];
            this.heap[this.parent(i)] = temp;
            i = this.parent(i);
        }
    }

    getTop() {
        if (this.isEmpty())
            return "Empty";
        return this.heap[0];
    }

    isEmpty() {
        return this.heap.length === 0;
    }

    pop() {
        if (this.length === 0) {
            console.log("heap is empty");
        } else if (this.length === 1) {
            this.heap[0] = this.heap.at(-1);
            this.heap.pop();
            this.length--;
        } else {
            this.heap[0] = this.heap.at(-1);
            this.heap.pop();
            this.length--;
            this.heapify(0);
        }
    }
};