import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

import Navbar from './Navbar';
import Channels from './Channels';
import Home from './Home';
import Chat from './Chat';

import data from '../data';

const GlobalStyle = createGlobalStyle`
  html, body, #root {
    font-family: Catamaran, Helvetica Neue, Helvetica, Arial, sans-serif;
    font-weight: 500;
    height: 100%;
    box-sizing: border-box;
  }

  *, *:before, *:after {
    box-sizing: inherit;
  }
`;

const StyledApp = styled.div`
  display: flex;
  height: 100%;
  width: 100%;

  .appContent {
    flex: 1 1 auto;
  }
`;

class App extends React.Component {
  state = {
    selectedGuildId: 1111,
    selectedChannelsId: {},
    currentArea: {
      type: 'CHAT'
    }
  };

  getContentComponent = () => {
    const { currentArea } = this.state;
    if (currentArea.type === 'HOME') {
      return Home;
    }
    if (currentArea.type === 'CHAT') {
      return Chat;
    }
  };

  getSelectedGuild = () => {
    const { selectedGuildId } = this.state;
    return selectedGuildId ? data.guilds.find(g => g.id === selectedGuildId) : null;
  };

  getChannelsHeaderContent = () => {
    const { selectedGuildId } = this.state;

    return selectedGuildId ? this.getSelectedGuild().name : 'textbox here soon';
  };

  getGuildCategories = () => {
    const guild = this.getSelectedGuild();
    return guild ? guild.categories : null;
  };

  getGuildSelectedChannelId = () => {
    const guild = this.getSelectedGuild();
    if (!guild) return null;
    return this.state.selectedChannelsId[guild.id] || guild.welcomeChannelId;
  };

  handleHomeClick = () => {
    this.setState({ selectedGuildId: null, currentArea: { type: 'HOME' } });
  };

  handleGuildClick = guildId => {
    this.setState({ selectedGuildId: guildId, currentArea: { type: 'CHAT' } });
  };

  handleChannelClick = (guildId, channelId) => {
    this.setState({
      selectedChannelsId: {
        ...this.state.selectedChannelsId,
        [guildId]: channelId
      }
    });
  };

  render() {
    const { selectedGuildId } = this.state;
    const ContentComponent = this.getContentComponent();
    const selectedGuild = this.getSelectedGuild();

    return (
      <StyledApp>
        <GlobalStyle />

        <Navbar
          onHomeClick={this.handleHomeClick}
          onGuildClick={this.handleGuildClick}
          selectedGuildId={selectedGuildId}
        />
        <Channels
          header={this.getChannelsHeaderContent()}
          categories={this.getGuildCategories()}
          guildId={selectedGuild.id}
          selectedChannelId={this.getGuildSelectedChannelId()}
          onChannelClick={this.handleChannelClick}
        />
        <ContentComponent className="appContent" channelName={'#general'} />
      </StyledApp>
    );
  }
}

export default App;
