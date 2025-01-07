import { cnpj, cpf } from "cpf-cnpj-validator";

const formatCPFOrCNPJ = (value: string): string => {
  const numericValue = value.replace(/\D/g, '');

  if (numericValue.length <= 11) {
    return cpf.format(value);
  }
  return cnpj.format(value);
}

export {
  formatCPFOrCNPJ
}