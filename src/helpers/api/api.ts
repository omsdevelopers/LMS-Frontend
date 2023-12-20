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
  baseURL: "https://webgoindia.com/public/api",
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
    const { data } = await api.post("/comments", {
      lead_id: payload.id,
      comment: payload.comment,
      postedOn: payload.postedOn,
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
    const { data } = await api.get(`/date_shedule/${id}`, {
      params: {
        is_shedule: 1,
        date_shedule: selectedTime,
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
    const { data } = await api.post(`/lead_category/${id}`, {
      category,
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

export const scheduledLeads = async (category?: string[], date?: any) => {
  try {
    const { data } = await api.get("/scheduled_lead", {
      params: {
        category,
        date: date,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const leadTagUpdate = async (id: number | undefined, tags: string[]) => {
  try {
    const { data } = await api.post(`/tagcreate/${id}`, {
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
