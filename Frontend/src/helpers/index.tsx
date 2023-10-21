export const timestampToDateTimeStrings = (timestampInSeconds: number): { date: string; time: string } => {
    const date = new Date(timestampInSeconds * 1000);
  
    // Explicitly specify the type of options as Intl.DateTimeFormatOptions
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
  
    const timeString = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
    return { date: dateString, time: timeString };
};