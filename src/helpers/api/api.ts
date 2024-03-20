import axios, { AxiosError } from "axios";
import { MessageItemTypes } from "../../components/ChatList";

interface FormData {
  comment: string;
  name: string;
  email: string;
  phone: string;
  platform: string;
  address: string;
  websiteDetails: string;
  projectDetails: string;
  interestedServices: string;
  servicesTaken: string;
  group: string;
  tags: string;
  category: string;
}

const api = axios.create({
  baseURL: "http://leadmanagement.test/api",
});

export const leadGeneration = async (formData: FormData): Promise<any> => {
  try {
    const {
      comment,
      name,
      email,
      phone,
      platform,
      address,
      websiteDetails,
      projectDetails,
      interestedServices,
      servicesTaken,
      group,
      tags,
      category,
    } = formData;

    const { data } = await api.post("/leads", {
      comment,
      name,
      email,
      phone,
      platform,
      address,
      websiteDetails,
      projectDetails,
      interestedServices,
      servicesTaken,
      group,
      tags,
      category,
    });

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axios.isAxiosError(error)) {
      if (axiosError.response) {
        throw axiosError.response.data.error;
      }
    }
  }
};

export const tableList = async () => {
  try {
    const { data } = await api.get("/age");

    return data.leads.data;
  } catch (error) {
    throw error;
  }
};

export const listLeads = async (
  category?: string[],
  date?: any,
  tags?: string[]
) => {
  try {
    const { data } = await api.get("/leadsall", {
      params: {
        category,
        date: date,
        tags,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const leadDelete = async (id: number) => {
  try {
    const { data } = await api.get(`/lead_delete/${id}`);

    return data.message;
  } catch (error) {
    throw error;
  }
};

export const leadEdit = async (id: number, formData: FormData) => {
  try {
    const {
      comment,
      name,
      email,
      phone,
      platform,
      address,
      websiteDetails,
      projectDetails,
      interestedServices,
      servicesTaken,
      group,
      tags,
      category,
    } = formData;

    const { data } = await api.post(`/lead_update/${id}`, {
      comment,
      name,
      email,
      phone,
      platform,
      address,
      websiteDetails,
      projectDetails,
      interestedServices,
      servicesTaken,
      group,
      tags,
      category,
    });

    return data.message;
  } catch (error) {
    throw error;
  }
};

export const leadCount = async (
  category?: any[],
  date?: any,
  tags?: string[]
) => {
  try {
    const { data } = await api.get("/leadsall", {
      params: {
        category,
        date,
        tags,
      },
    });
    localStorage.setItem("lead_count", data.lead_count);
    return data.lead_count;
  } catch (error) {
    throw error;
  }
};

export const leadByID = async (id: number | undefined) => {
  try {
    const { data } = await api.get(`/singleleads/${id}`);

    return data.leads;
  } catch (error) {
    throw error;
  }
};

export const everyLeadByID = async (id: number | undefined) => {
  try {
    const { data } = await api.get(`/everysingleleads/${id}`);

    return data.leads;
  } catch (error) {
    throw error;
  }
};

export const scheduleLeadByID = async (id: number | undefined) => {
  try {
    const { data } = await api.get(`/sheduledsingleleads/${id}`);

    return data.leads;
  } catch (error) {
    throw error;
  }
};

export const commands = async (payload: Record<string, any>) => {
  try {
    const userString:any = localStorage.getItem('user');

    const user = JSON.parse(userString);
    const userId = user.id; 

    const { data } = await api.post("/comments", {
      lead_id: payload.id,
      comment: payload.comment,
      postedOn: payload.postedOn,
      userId
    });

    return data.comments;
  } catch (error) {
    throw error;
  }
};

export const fetchCommands = async (id: number) => {
  try {
    const { data } = await api.get(`/message_get/${id}`);

    return data.comment;
  } catch (error) {
    throw error;
  }
};

export const leadSchedule = async (
  id: number | undefined,
  selectedTime: string
) => {
  try {
    const userString:any = localStorage.getItem('user');

    const user = JSON.parse(userString);
    const userId = user.id; 

    const { data } = await api.get(`/date_shedule/${id}`, {
      params: {
        is_shedule: 1,
        date_shedule: selectedTime,
        userId
      },
    });

    return data.message;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axios.isAxiosError(error)) {
      if (axiosError.response) {
        throw axiosError.response.data.error;
      }
    }
  }
};

export const leadCategoryUpdate = async (
  id: number | undefined,
  category: string
) => {
  try {

    const userString:any = localStorage.getItem('user');

    const user = JSON.parse(userString);
    const userId = user.id; 

    const { data } = await api.post(`/lead_category/${id}`, {
      category,
      userId
    });

    return data.message;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axios.isAxiosError(error)) {
      if (axiosError.response) {
        throw axiosError.response.data.error;
      }
    }
  }
};

export const scheduledLeads = async (
  category?: string[],
  date?: any,
  tags?: string[]
) => {
  try {
    const { data } = await api.get("/scheduled_lead", {
      params: {
        category,
        date: date,
        tags,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const leadTagUpdate = async (id: any | undefined, tags: string[]) => {
  try {
    const userString:any = localStorage.getItem('user');

    const user = JSON.parse(userString);
    const userId = user.id; 

    const { data } = await api.post(`/tagcreate/${id}`, {
      tags,
      userId
    });

    return data.message;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axios.isAxiosError(error)) {
      if (axiosError.response) {
        throw axiosError.response.data.error;
      }
    }
  }
};

export const everyLeads = async (
  category?: string[],
  date?: any,
  tags?: string[]
) => {
  try {
    const { data } = await api.get(`/every-leads`, {
      params: {
        category,
        date: date,
        tags,
      },
    });

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axios.isAxiosError(error)) {
      if (axiosError.response) {
        throw axiosError.response.data.error;
      }
    }
  }
};

export const getTags = async (formatted?: number) => {
  try {
    const { data } = await api.get(`/get-tags`, {
      params: {
        formatted,
      },
    });;

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axios.isAxiosError(error)) {
      if (axiosError.response) {
        throw axiosError.response.data.error;
      }
    }
  }
};

export const createGroup = async (
  title: string,
  category: string[],
  tags: string[]
) => {
  try {
    const { data } = await api.post(`/group-create`, {
      title,
      category,
      tags,
    });

    return data.message;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axios.isAxiosError(error)) {
      if (axiosError.response) {
        throw axiosError.response.data.error;
      }
    }
  }
};

export const getGroups = async () => {
  try {
    const { data } = await api.get(`/group-get`);

    return data;
  } catch (error) {
    const axiosError = error as AxiosError;

    if (axios.isAxiosError(error)) {
      if (axiosError.response) {
        throw axiosError.response.data.error;
      }
    }
  }
};

export const groupDelete = async (id: number) => {
  try {
    const { data } = await api.delete(`/group-delete/${id}`);

    return data.message;
  } catch (error) {
    throw error;
  }
};

export const getLeadByGroup = async (id: any) => {
  try {
    const { data } = await api.get(`/groupLeadsById/${id}`);

    return data.leads;
  } catch (error) {
    throw error;
  }
};

export const saveTags = async (tags: string) => {
  try {
    const { data } = await api.post(`/save-tags`, {
      tags,
    });

    return data.message;
  } catch (error) {
    throw error;
  }
};

export const tagDelete = async (id: number) => {
  try {
    const { data } = await api.delete(`/tag-delete/${id}`);

    return data.message;
  } catch (error) {
    throw error;
  }
};

export const getActivity = async (date: string) => {
  try {
    const { data } = await api.get(`/log-activity`,{
      params: {
        date,
      },
    });

    return data.activity;
  } catch (error) {
    throw error;
  }
};
