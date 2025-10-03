export interface Timestamp {
    seconds: number;
    nanoseconds: number;
  }
  
  export interface Message {
    sender: string;
    text: string;
    timestamp: Timestamp;
  }
  