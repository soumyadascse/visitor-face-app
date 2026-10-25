import { supabase } from "./supabase";
import type { Visitor } from "../types/visitor";
import type { VisitLog } from "../types/visitLog";

export interface DbVisitor {
  id: string;
  name: string;
  mobile: string;
  gender: string;
  flat_number: string;
  purpose: string;
  image_url: string;
  face_descriptor: number[];
}

export const saveVisitor = async (visitor: Visitor) => {
  const { data, error } = await supabase
    .from("visitors")
    .insert({
      name: visitor.name,
      mobile: visitor.mobile,
      gender: visitor.gender,
      flat_number: visitor.flatNumber,
      purpose: visitor.purpose,
      face_descriptor: visitor.faceDescriptor,
      image_url: visitor.imageUrl,
    })
    .select();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
};

export const getVisitors = async (): Promise<DbVisitor[]> => {
  const { data, error } = await supabase.from("visitors").select("*");

  if (error) {
    throw error;
  }

  return (data ?? []) as DbVisitor[];
};

export const saveVisitLog = async (log: VisitLog) => {
  const { data, error } = await supabase
    .from("visit_logs")
    .insert({
      visitor_id: log.visitor_id,
      visitor_name: log.visitor_name,
      flat_number: log.flat_number,
      emotion: log.emotion,
      estimated_age: log.estimated_age,
    })
    .select();

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
};

export const getVisitLogs = async () => {
  const { data, error } = await supabase
    .from("visit_logs")
    .select("*")
    .order("visit_time", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data;
};
