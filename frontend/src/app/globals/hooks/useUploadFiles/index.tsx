import axios from 'axios';
import { useMutation } from "@tanstack/react-query";

export const useUploadFile = () => {
  const mutation = useMutation({
    mutationKey: ["uploadFile"],
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const { data, status } = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/transactions`, formData, {
        timeout: 0,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return { data, status }
    },
    onSuccess: () => {
      //alert('Arquivo enviado com sucesso!');
    },
    onError: (error: Error) => {
      console.error("Erro ao enviar o arquivo", error.message);
      //alert('Erro ao enviar o arquivo.');
    },
  });

  return mutation;
};
