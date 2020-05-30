//Data that should be tracked include, date of requested, description of request, technician assigned, date of completion and notes.
export interface Issue {
    id: string;
    title: string;
    dateStart: string;
    dateEnd: string;
    lastModified: string;
    desc: {
        summary: string,
        reproduce: string,
        expctRes: string,
        actlRes: string
      },  
    tech: string;
    priority: string;
    status: string;
    notes: string[];
}