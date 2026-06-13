// Utilitats compartides per formatar dades de pacients i sessions

export function calcularEdat(dataNaixement: string): number {
  const naixement = new Date(dataNaixement);
  const avui = new Date();
  let edat = avui.getFullYear() - naixement.getFullYear();
  const encaraNoHaFetAnys =
    avui.getMonth() < naixement.getMonth() ||
    (avui.getMonth() === naixement.getMonth() &&
      avui.getDate() < naixement.getDate());
  if (encaraNoHaFetAnys) edat--;
  return edat;
}

export function formatData(data: string): string {
  return new Date(data).toLocaleDateString("ca-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function dataAvui(): string {
  return new Date().toISOString().slice(0, 10);
}
