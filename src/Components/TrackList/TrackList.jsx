import React from "react";
import "./TrackList.css";
import { Track } from "../Track/Track";

export class TrackList extends React.Component {
  render() {
    return (
      <div className="TrackList">
        {this.props.tracks.map((track) => {
          return (
            <Track
              isRemoval={this.props.isRemoval}
              key={track.id}
              onAdd={this.props.onAdd}
              onRemove={this.props.onRemove}
              track={track}
            />
          );
        })}
      </div>
    );
  }
}
