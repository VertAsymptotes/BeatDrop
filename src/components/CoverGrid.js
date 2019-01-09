import React, { Component } from 'react';
import '../css/CoverGrid.css'
import CoverGridItem from './CoverGridItem'
import LoadMore from './LoadMore'

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { refresh, loadMore } from '../actions/songListActions'

function MapSongs(props) {
  if(props.loading) {
    return (
      Array(15).fill(0).map((v, i) => {
        return <CoverGridItem key={i} loading />
      })
    )
  } else {
    return (
      props.songs.map((song, index) => {
        return <CoverGridItem key={index} songKey={song.key} title={song.songName} artist={song.authorName} uploader={song.uploader} coverImage={song.coverUrl} difficulties={song.difficulties} file={song.file} />
      })
    )
  }
}

class CoverGrid extends Component {

  componentDidMount() {
    document.getElementById('cover-grid-container').addEventListener('scroll', this.onScroll.bind(this))
    document.getElementById('cover-grid-container').scrollTop = this.props.scrollTop
  }
  
  componentWillUnmount() {
    document.getElementById('cover-grid-container').removeEventListener('scroll', this.onScroll)
  }

  onScroll() {
    let coverGridContainer = document.getElementById('cover-grid-container')
    if(((coverGridContainer.scrollHeight - coverGridContainer.scrollTop) - coverGridContainer.clientHeight) <= 1) {
      if(!this.props.loadingMore && !this.props.loading && this.props.autoLoadMore) {
        if(this.props.songs.songs.length >= this.props.songs.totalSongs) return
        this.props.loadMore()
      }
    }
  }

  render() {
    return (
      <div id="cover-grid-container">
        <div className="cover-grid">
          <MapSongs loading={this.props.loading} songs={this.props.songs.songs} />
        </div>
        <LoadMore />
      </div>
    )
  }
}

CoverGrid.propTypes = {
  songs: PropTypes.object.isRequired,
  scrollTop: PropTypes.number.isRequired,
  loading: PropTypes.bool.isRequired,
  refresh: PropTypes.func.isRequired,
  loadMore: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  songs: state.songs,
  scrollTop: state.songs.scrollTop,
  loading: state.loading,
  autoLoadMore: state.settings.autoLoadMore
})

export default connect(mapStateToProps, { refresh, loadMore })(CoverGrid)