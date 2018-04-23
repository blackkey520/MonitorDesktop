import React from 'react';
import { observer, inject } from 'mobx-react';
import ansiHTML from 'ansi-html';
@inject(stores => ({
    consolelog: stores.global.consolelog.slice(0),
}))
@observer
export default class Terminal extends React.Component {
    render() {
        const log = ansiHTML(this.props.consolelog.join('<br>'));
        return (
            <div
                style={{ width: '100%',
                    height: 'calc(100vh - 120px)' }}
            >
                <div style={{width: '100%',
                    height: 'calc(100vh - 120px)',
                    overflow: 'scroll'}} dangerouslySetInnerHTML={{ __html: log }} />
            </div>
        );
    }
}
