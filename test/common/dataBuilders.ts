import { RotatorData } from '../../src/components/rotator/type';
import { MovieGridData } from '../../src/types/MovieGridData';
import { TitleData } from '../../src/types/TitleData';

export class TitleDataBuilder {
  private id: string;
  private title: string = 'some title';
  private description: string = 'some description';
  private duration: number = 0;
  private thumbnail: string =
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg';
  private posterUrl: string =
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg';
  private uri: string =
    'http://edge-vod-media.cdn01.net/encoded/0000169/0169313/video_1880k/T7J66Z106.mp4?source=firetv&channelID=1234';
  private categories: string[] = ['Costa Rica Islands'];
  private channelID: string = '1234';
  private format: string = 'some format';
  private uhd: boolean = false;
  private secure: boolean = false;
  private rentAmount: string = '10';

  constructor(id: string) {
    this.id = id;
  }

  setTitle(title: string): TitleDataBuilder {
    this.title = title;
    return this;
  }

  setDescription(description: string): TitleDataBuilder {
    this.description = description;
    return this;
  }

  setDuration(duration: number): TitleDataBuilder {
    this.duration = duration;
    return this;
  }

  setThumbnail(thumbnail: string): TitleDataBuilder {
    this.thumbnail = thumbnail;
    return this;
  }

  setPosterUrl(posterUrl: string): TitleDataBuilder {
    this.posterUrl = posterUrl;
    return this;
  }

  setUri(uri: string): TitleDataBuilder {
    this.uri = uri;
    return this;
  }

  setCategories(categories: string[]): TitleDataBuilder {
    this.categories = categories;
    return this;
  }

  setChannelID(channelID: string): TitleDataBuilder {
    this.channelID = channelID;
    return this;
  }

  setFormat(format: string): TitleDataBuilder {
    this.format = format;
    return this;
  }

  setUhd(uhd: boolean): TitleDataBuilder {
    this.uhd = uhd;
    return this;
  }

  setSecure(secure: boolean): TitleDataBuilder {
    this.secure = secure;
    return this;
  }

  setRentAmount(rentAmount: string): TitleDataBuilder {
    this.rentAmount = rentAmount;
    return this;
  }

  build(): TitleData {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      duration: this.duration,
      thumbnail: this.thumbnail,
      posterUrl: this.posterUrl,
      uri: this.uri,
      categories: this.categories,
      channelID: this.channelID,
      mediaType: 'video',
      mediaSourceType: 'url',
      format: this.format,
      uhd: this.uhd,
      secure: this.secure,
      rentAmount: this.rentAmount,
    };
  }
}

export class MovieGridDataBuilder {
  private heading: string;
  private testID: string;
  private tileData: TitleData[] = [];

  constructor(heading: string, testID: string) {
    this.heading = heading;
    this.testID = testID;
  }

  addTile(tileData: TitleData): MovieGridDataBuilder {
    this.tileData.push(tileData);
    return this;
  }

  build(): MovieGridData {
    return {
      heading: this.heading,
      testID: this.testID,
      data: () => this.tileData,
    };
  }
}

export class RotatorDataBuilder {
  private id: string;
  private title: string = 'title';
  private description: string = 'description';
  private descriptionType: string = 'Standard MP4 stream for mobile devices';
  private duration: string = '100';
  private thumbnailUrl: string =
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg';
  private posterUrl: string =
    'http://le2.cdn01.net/videos/0000169/0169313/thumbs/0169313__007f.jpg';
  private videoUrl: string =
    'http://edge-vod-media.cdn01.net/encoded/0000169/0169313/video_1880k/T7J66Z106.mp4?source=firetv&channelID=1234';
  private categories: string[] = ['Costa Rica Islands'];
  private channelID: string = '100';
  private rating: string = '20';
  private releaseDate: string = '1/1/1970';

  constructor(id: string) {
    this.id = id;
  }

  setTitle(title: string): RotatorDataBuilder {
    this.title = title;
    return this;
  }

  setDescription(description: string): RotatorDataBuilder {
    this.description = description;
    return this;
  }

  setDuration(duration: string): RotatorDataBuilder {
    this.duration = duration;
    return this;
  }

  setThumbnailUrl(thumbnailUrl: string): RotatorDataBuilder {
    this.thumbnailUrl = thumbnailUrl;
    return this;
  }

  setPosterUrl(posterUrl: string): RotatorDataBuilder {
    this.posterUrl = posterUrl;
    return this;
  }

  setVideoUrl(videoUrl: string): RotatorDataBuilder {
    this.videoUrl = videoUrl;
    return this;
  }

  setCategories(categories: string[]): RotatorDataBuilder {
    this.categories = categories;
    return this;
  }

  setChannelID(channelID: string): RotatorDataBuilder {
    this.channelID = channelID;
    return this;
  }

  setRating(rating: string): RotatorDataBuilder {
    this.rating = rating;
    return this;
  }

  setReleaseDate(releaseDate: string): RotatorDataBuilder {
    this.releaseDate = releaseDate;
    return this;
  }

  build(): RotatorData {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      descriptionType: this.descriptionType,
      duration: this.duration,
      thumbnailUrl: this.thumbnailUrl,
      posterUrl: this.posterUrl,
      videoUrl: this.videoUrl,
      categories: this.categories,
      channelID: this.channelID,
      rating: this.rating,
      releaseDate: this.releaseDate,
    };
  }
}
