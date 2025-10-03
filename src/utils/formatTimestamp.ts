// utils/formatTimestamp.ts

export interface FirestoreTimestamp {
    seconds: number;
    nanoseconds: number;
  }
  
  /**
   * Format Firestore-like timestamp into human-readable date (with optional time).
   * @param timestamp FirestoreTimestamp | null | undefined
   * @param showTime Whether to include time in the formatted string
   * @returns Formatted date string
   */
  export const formatTimestamp = (
    timestamp?: FirestoreTimestamp | null,
    showTime: boolean = false
  ): string => {
    const defaultTimestamp: FirestoreTimestamp = { seconds: 0, nanoseconds: 0 };
    const { seconds, nanoseconds } = timestamp || defaultTimestamp;
  
    const date = new Date(seconds * 1000 + nanoseconds / 1_000_000);
  
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
  
    const formattedDate = date.toLocaleDateString("en-US", dateOptions);
    const formattedTime = date.toLocaleTimeString("en-US", timeOptions);
  
    const day = date.getDate();
    const suffix =
      day >= 11 && day <= 13
        ? "th"
        : day % 10 === 1
        ? "st"
        : day % 10 === 2
        ? "nd"
        : day % 10 === 3
        ? "rd"
        : "th";
  
    const finalDate = formattedDate.replace(/(\d+)/, `$1${suffix}`);
  
    return showTime ? `${finalDate} · ${formattedTime}` : finalDate;
  };
  
  export default formatTimestamp;
  