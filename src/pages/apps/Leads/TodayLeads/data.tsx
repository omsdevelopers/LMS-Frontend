// images
import avatar2 from '../../../../assets/images/users/avatar-2.jpg';
import avatar3 from '../../../../assets/images/users/avatar-3.jpg';
import avatar4 from '../../../../assets/images/users/avatar-4.jpg';
import avatar5 from '../../../../assets/images/users/avatar-5.jpg';
import avatar6 from '../../../../assets/images/users/avatar-6.jpg';
import avatar7 from '../../../../assets/images/users/avatar-7.jpg';
import avatar8 from '../../../../assets/images/users/avatar-8.jpg';

export interface TaskTypes {
    id: number;
    Name: string;
    Phone: string;
    status: string;
    Email: string;
    Category: string;
    CallTime: { Date: string; Time: string };
    Address: string;
    Comment: string;
    Tag: string;
    Platform: string;
    WebsiteDetails: string;
    ProjectDetails: string;
    InterestedServices: string;
    ServicesTaken: string;
    LeadGroup: string;
    priority: string;
}

const tasks: TaskTypes[] = [

    {
        id:1,
        Name: 'Office',
        Phone: '+911111111112',
        status: 'FreshLead',
        Email: 'office@example.com',
        Category: 'New Lead',
        CallTime: { Date: '07/Dec/2023', Time: '08:32PM' },
        Address: '123 Main Street, Cityville',
        Comment: 'Interested in discussing potential projects.',
        Tag: 'Important',
        Platform: 'Web',
        WebsiteDetails: 'http://www.officewebsite.com',
        ProjectDetails: 'Looking for a website redesign.',
        InterestedServices: 'Web Development, UI/UX Design',
        ServicesTaken: 'None yet',
        LeadGroup: 'Sales',
        priority: 'Low',
    },
    {
        id:2,
        Name: 'Company XYZ',
        Phone: '+911234567890',
        Email: 'xyz@company.com',
        status: 'FreshLead',
        Category: 'New Lead',
        CallTime: { Date: '07/Dec/2023', Time: '09:45PM' },
        Address: '456 Business Avenue, Townsville',
        Comment: 'Exploring options for software development.',
        Tag: 'Potential Client',
        Platform: 'Mobile',
        priority: 'High',
        WebsiteDetails: 'http://www.xyzcompany.com',
        ProjectDetails: 'Interested in a mobile app for their business.',
        InterestedServices: 'Mobile App Development, Backend Services',
        ServicesTaken: 'None yet',
        LeadGroup: 'Tech'
    },
];


export { tasks };
