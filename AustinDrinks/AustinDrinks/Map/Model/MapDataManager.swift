//
//  MapDataManager.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/31/22.
//

import Foundation
import MapKit
import AVFAudio

class MapDataManager: DataManager {
    private var items: [EstablishmentItem] = []
    var annotations: [EstablishmentItem] {
        items
    }
    var selectedCity: LocationItem?
    
    
    let selector = LocationViewController()
    
    
    func fetch(completion: (_ annotations: [EstablishmentItem]) -> ()) {
        let manager = EstablishmentDataManager()
        
//        let index = selector.cityIndexSelector()
//        let index = selector.tableView.indexPathsForSelectedRows!
        
        let locale = LocationDataManager()
        locale.fetch()
        selectedCity = locale.locationItem(at: 0) // index
        guard let city = selectedCity?.city else { return }
//        manager.fetch(location: "Austin", completionHandler: {
        manager.fetch(location: city, completionHandler: {
            (establishmentItems) in self.items = establishmentItems
            completion(items)
        })
    }
    
    func initialRegion(latDelta: CLLocationDegrees, longDelta: CLLocationDegrees) -> MKCoordinateRegion {
        guard let item = items.first else {
            return MKCoordinateRegion()
        }

        let span = MKCoordinateSpan(latitudeDelta: latDelta, longitudeDelta: longDelta)
        return MKCoordinateRegion(center: item.coordinate, span: span)
    }
    
    func currentRegion(latDelta: CLLocationDegrees, longDelta: CLLocationDegrees) -> MKCoordinateRegion {
        guard let item = items.first else {
            return MKCoordinateRegion()
        }

        let span = MKCoordinateSpan(latitudeDelta: latDelta, longitudeDelta: longDelta)
        return MKCoordinateRegion(center: item.coordinate, span: span)
    }
}

