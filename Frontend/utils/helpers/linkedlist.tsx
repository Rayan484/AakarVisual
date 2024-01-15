class node {
  public data: any;
  public next: node | null;
  public prev: node | null;
  constructor(data: any) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}
//linkedlist to perform undo and redo
class linkedlist {
  public head: node | null;
  public tail: node | null;
  constructor(data: any) {
    this.head = null;
    this.tail = null;
  }
  insert(data: any) {
    let newNode = new node(data);
    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      let temp = this.head;
      while (temp.next !== null) {
        temp = temp.next;
      }
      temp.next = newNode;
      newNode.prev = temp;
      this.tail = newNode;
    }
  }
  undo() {
    if (this.tail === null) {
      return;
    }
    const prev = this.tail!.prev;
    if (prev) {
      this.tail = prev;
      return prev.data;
    }
  }
  redo() {
    if (this.tail === null) {
      return;
    }
    const next = this.tail!.next;
    if (next) {
      this.tail = next;
      return next.data;
    }
  }
  reset() {
    this.tail = this.head;
    this.tail!.next = null;
  }
  setImage(data: any) {
    this.tail = null;
    this.head = null;
    this.insert(data);
  }
}
let undoRedo = new linkedlist(null);
export default undoRedo;
