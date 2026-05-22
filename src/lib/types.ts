export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
    url?: string;
    metadata?: {
      dimensions?: {
        width?: number;
        height?: number;
      };
    };
  };
  alt?: string;
  mobileImage?: SanityImage;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  dimensions?: {
    width?: number;
    height?: number;
  };
}

export interface Post {
  _id: string;
  title: string;
  homeTitle?: string;
  slug: string;
  category?: 'tips' | 'eventos' | 'nuevo' | string;
  excerpt?: string;
  publishedAt?: string;
  heroDisplayMode?: 'featured' | 'slider';
  homeImage?: SanityImage;
  heroImages?: SanityImage[];
  galleryPhotos?: SanityImage[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any[];
}

export interface MotoSpec {
  label: string;
  value: string;
}

export interface SanityFile {
  asset?: {
    url?: string;
    originalFilename?: string;
  };
}

export interface MotoAdditionalFeature {
  titulo: string;
  detalle: string;
  imagen: SanityImage;
}

export interface MotoInfoSection {
  titulo: string;
  descripcion: string;
  imagenFondo: SanityImage;
}

export interface MotoScrollSequenceFrame extends SanityImage {
  grado?: number;
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
  estiloHero?: 'titleLeftDetailRight' | 'titleRightDetailLeft' | 'titleCenterNoDetail';
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

export interface ConcesionariosPageService {
  titulo: string;
  icono?: SanityImage;
  iconKey?: 'ventas' | 'repuestos' | 'servicios' | string;
}

export interface ConcesionariosPage {
  _id: string;
  titulo: string;
  tituloDestacado: string;
  descripcion: string;
  servicios?: ConcesionariosPageService[];
}

export interface DescubreMasPage {
  _id: string;
  titulo: string;
  tituloDestacado?: string;
  descripcion: string;
  imagenFondo: SanityImage;
  descripcionInferior: string;
  textoGrandeInferior: string;
  botonTexto: string;
  botonUrl: string;
}

export interface ProteccionDatosPage {
  _id: string;
  titulo: string;
  descripcionSeo?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contenido?: any[];
}

export interface Moto {
  _id: string;
  nombre: string;
  slug: string;
  apiMotoId?: string;
  marca?: string;
  modelo?: string;
  anio?: number;
  precio?: number;
  precioAnterior?: number;
  enOferta?: boolean;
  destacada?: boolean;
  imagenPrincipal?: SanityImage;
  imagenSliderHome?: SanityImage;
  mostrarNombreGigante?: boolean;
  fotoHeader?: SanityImage;
  fotoOferta?: SanityImage;
  scrollSequenceFrames?: MotoScrollSequenceFrame[];
  heroImagenes?: SanityImage[];
  zonaInformativa?: MotoInfoSection;
  caracteristicasAdicionales?: MotoAdditionalFeature[];
  fichaTecnica?: SanityFile;
  galeria?: SanityImage[];
  galeriaFotos?: SanityImage[];
  colores?: { nombre: string; codigoHex?: string; imagen: SanityImage }[];
  ctaFinal?: { titulo: string; imagenFondo: SanityImage };
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

export interface Oferta {
  _id: string;
  apiMotoId: string;
  slug?: string;
  orden?: number;
  imagenFondo?: SanityImage; // resuelto desde moto.fotoOferta via query
}

export interface HomeOffer extends Omit<Oferta, 'imagenFondo'> {
  imagenFondo: SanityImage;
  apiModel: PromobilityMotoModel;
  displayName: string;
  displayListPrice?: string | null;
  displayBonus?: string | null;
}
