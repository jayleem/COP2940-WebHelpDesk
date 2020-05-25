//Data that should be tracked include, date of requested, description of request, technician assigned, date of completion and notes.
export interface Issue {
    id: string;
    title: string;
    dateStart: string;
    dateEnd: string;
    desc: string;   
    tech: string;
    status: string;
    notes: string[];
}