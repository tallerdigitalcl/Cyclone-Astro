export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
}

export interface Author {
  name: string;
  image?: SanityImage;
}

export interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  mainImage?: SanityImage;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[];
  author?: Author;
}

export interface MotoSpec {
  label: string;
  value: string;
}

export interface PromobilityMotoColor {
  id: number;
  name: string;
  color: string;
}

export interface PromobilityMotoModel {
  id: number;
  modelo: string;
  marca?: string;
  'año'?: number;
  precio_lista?: string | null;
  bono?: string | null;
  precio?: string | null;
  financiamiento?: boolean;
  codigo_marca?: number;
  codigo_spider?: string;
  peso?: string | null;
  altura_asiento?: string | null;
  cilindrada?: string | null;
  tank_capacity?: string | null;
  colors?: PromobilityMotoColor[];
}

export interface HeroStat {
  etiqueta: string;
  valor: string;
  unidad?: string;
}

export interface HeroSlide {
  _id: string;
  titulo1: string;
  titulo2?: string;
  descripcion?: string;
  botonTexto?: string;
  botonUrl?: string;
  stats?: HeroStat[];
  imagen: SanityImage;
  imagenMobile?: SanityImage;
}

export interface HomeInfoSection {
  _id: string;
  titulo: string;
  descripcion: string;
  botonTexto?: string;
  botonUrl?: string;
  imagenFondo: SanityImage;
}

export interface Moto {
  _id: string;
  nombre: string;
  slug: string;
  apiMotoId?: string;
  tituloDescriptivo?: string;
  marca?: string;
  modelo?: string;
  anio?: number;
  precio?: number;
  precioAnterior?: number;
  enOferta?: boolean;
  destacada?: boolean;
  imagenPrincipal?: SanityImage;
  imagenSliderHome?: SanityImage;
  heroImagenes?: SanityImage[];
  galeria?: SanityImage[];
  galeriaFotos?: SanityImage[];
  descripcion?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[];
  specs?: MotoSpec[];
}

export interface HomeSliderMoto extends Moto {
  apiModel: PromobilityMotoModel;
  displayName: string;
  displayPrice?: string | null;
  displayListPrice?: string | null;
  displayBonus?: string | null;
}
