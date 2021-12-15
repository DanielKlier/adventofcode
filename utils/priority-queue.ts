interface QueueElem<T> {
  value: T;
  priority: number;
}

export class PriorityQueue<T> {
  private values: QueueElem<T>[] = [];

  get length() {
    return this.values.length;
  }

  // method that pushes new value onto the end and calls the bubble helper
  unshift(value: T, priority: number) {
    this.values.push({ value, priority });
    //calculate parent, if parent is greater swap
    //while loop or recurse
    this.bubbleUp();
    return this.values;
  }

  shift() {
    //swap first and last element
    this.swap(0, this.values.length - 1);
    //pop max value off of values
    const poppedNode = this.values.pop();
    //re-adjust heap if length is greater than 1
    if (this.values.length > 1) {
      this.bubbleDown();
    }

    return poppedNode;
  }

  //helper method that swaps the values and two indexes of an array
  private swap(index1: number, index2: number) {
    const temp = this.values[index1];
    this.values[index1] = this.values[index2];
    this.values[index2] = temp;
    return this.values;
  }

  //helper methods that bubbles up values from end
  private bubbleUp() {
    //get index of inserted element
    let index = this.values.length - 1;
    //loop while index is not 0 or element no loger needs to bubble
    while (index > 0) {
      //get parent index via formula
      const parentIndex = Math.floor((index - 1) / 2);
      //if values is greater than parent, swap the two
      if (this.values[parentIndex].priority > this.values[index].priority) {
        //swap with helper method
        this.swap(index, parentIndex);
        //change current index to parent index
        index = parentIndex;
      } else {
        break;
      }
    }
    return 0;
  }

  private bubbleDown() {
    let parentIndex = 0;
    const length = this.values.length;
    const elementPriority = this.values[0].priority;
    //loop breaks if no swaps are needed
    while (true) {
      //get indexes of child elements by following formula
      const leftChildIndex = 2 * parentIndex + 1;
      const rightChildIndex = 2 * parentIndex + 2;
      let leftChildPriority: number, rightChildPriority: number;
      let indexToSwap = null;
      // if left child exists, and is greater than the element, plan to swap with the left child index
      if (leftChildIndex < length) {
        leftChildPriority = this.values[leftChildIndex].priority;
        if (leftChildPriority < elementPriority) {
          indexToSwap = leftChildIndex;
        }
      }
      //if right child exists
      if (rightChildIndex < length) {
        rightChildPriority = this.values[rightChildIndex].priority;

        if (
          //if right child is greater than element and there are no plans to swap
          (rightChildPriority < elementPriority && indexToSwap === null) ||
          //OR if right child is greater than left child and there ARE plans to swap
          (rightChildPriority < leftChildPriority! && indexToSwap !== null)
        ) {
          //plan to swap with the right child
          indexToSwap = rightChildIndex;
        }
      }
      //if there are no plans to swap, break out of the loop
      if (indexToSwap === null) {
        break;
      }
      //swap with planned element
      this.swap(parentIndex, indexToSwap);
      //starting index is now index that we swapped with
      parentIndex = indexToSwap;
    }
  }
}
