export default class Pokemon {
  id: number;
  name: string;
  type: string;
  pic: string;
  color?: string;

  constructor(id: number, name: string, type: string, pic: string, color?: string) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.pic = pic;
    this.color = color;
  }
  
}
