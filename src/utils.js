import geolib from 'geolib';

export function buildCarouselMessages(sortedData, presentLocation) {
  const columns = [];

  for (let i = 0; i < 3; i++) {
    const column = {
      title: `${sortedData[i].port.number}. ${sortedData[i].port.name}`,
      text: `${sortedData[i].port.available_bikes}台貸出可能\n${sortedData[i].port.empty_racks}台返却可能\nポートまで${sortedData[i].distanceStr} (徒歩${Math.ceil(sortedData[i].distance / 80)}分)`,
      actions: [{
        type: 'uri',
        label: '道順を調べる',
        uri: `http://maps.google.com/maps?saddr=${presentLocation.latitude},${presentLocation.longitude}&daddr=${sortedData[i].port.latitude},${sortedData[i].port.longitude}&dirflg=w`,
      }],
    };
    columns.push(column);
  }

  const messages = [{
    type: 'template',
    altText: 'お近くの自転車貸出可能なまちのりのポートをご案内します',
    template: {
      type: 'carousel',
      columns,
    },
  }];

  return messages;
}

export function createDistanceData(ports, presentLocation) {
  const distanceData = [];
  ports.port.forEach((port) => {
    const distance = geolib.getDistance(
      presentLocation,
      { latitude: port.latitude, longitude: port.longitude },
    );
    let distanceStr = '';
    if (distance >= 1000) {
      distanceStr = `${geolib.convertUnit('km', distance)}km`;
    } else {
      distanceStr = `${distance}m`;
    }

    if (port.available_bikes > 0) {
      distanceData.push({ port, distance, distanceStr });
    }
  });
  return distanceData;
}
