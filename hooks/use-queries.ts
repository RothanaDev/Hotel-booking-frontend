"use client"

import { useQuery } from "@tanstack/react-query"
import * as api from "@/lib/api"

/**
 * Hook to fetch all room types.
 * Used for filtering rooms by category.
 */
export function useAllRoomTypes() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["room-types"],
    queryFn: api.getAllRoomTypes,
  });
  return { data, isLoading, error };
}

/**
 * Hook to fetch all available services.
 * Used in the services page and the services dropdown.
 */
export function useAllServices() {
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["all-services"],
    queryFn: api.getAllServices,
    retry: false,
  });
  return { data, isLoading, error };
}
