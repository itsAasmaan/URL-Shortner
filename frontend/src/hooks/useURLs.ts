import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import urlService from "../services/urlService";
import toast from "react-hot-toast";

export const useURL = (page: number = 1, limit: number = 20) => {
  return useQuery({
    queryKey: ["urls", page, limit],
    queryFn: () => urlService.getUserURLs(page, limit),
  });
};

export const useDeleteURL = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shortCode: string) => urlService.deleteURL(shortCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["urls"] });
      toast.success("URL deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete URL");
    },
  });
};
