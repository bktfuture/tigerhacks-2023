import { createContext } from "react";
import { ISong } from "../interfaces/ISong";
import Images from "./Images";

interface IProps {
    song: ISong;
    setSong: any;
}

export const AppContext = createContext<IProps>({
    song: {
        name: 'Dance The Night',
        artist: 'Dua Lipa',
        img: Images.duaLipa,
        track: 'pathtotrack'
    },
    setSong: (a: ISong) => {}
});