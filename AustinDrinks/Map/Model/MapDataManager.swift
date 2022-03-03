//
//  MapDataManager.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/22/22.
//

import Foundation
import MapKit

class MapDataManager: DataManager {
    private var items: [EstablishmentItem] = []
    var annotations: [EstablishmentItem] {
        items
    }
    
    func fetch(completion: (_ annotations: [EstablishmentItem]) -> ()) {
        let manager = EstablishmentDataManager()
<<<<<<< HEAD
<<<<<<< HEAD
        manager.fetch(location: "austin_TX", completionHandler: {
//        manager.fetch(location: "Austin", completionHandler: {   // Is there something wrong here?
=======
        manager.fetch(location: "austin_TX", completionHandler: {   // Is there something wrong here?
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
        manager.fetch(location: "austin_TX", completionHandler: {   // Is there something wrong here?
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
            (establishmentItems) in self.items = establishmentItems
            completion(items)   
        })
    }
    
<<<<<<< HEAD
<<<<<<< HEAD
    func initialRegion(latDelta: CLLocationDegrees, longDelta: CLLocationDegrees) -> MKCoordinateRegion {  // uses initialRegion on page 396
=======
    func initialRegion(latDelta: CLLocationDegrees, longDelta: CLLocationDegrees) -> MKCoordinateRegion {
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
    func initialRegion(latDelta: CLLocationDegrees, longDelta: CLLocationDegrees) -> MKCoordinateRegion {
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
        guard let item = items.first else {
            return MKCoordinateRegion()
        }

        let span = MKCoordinateSpan(latitudeDelta: latDelta, longitudeDelta: longDelta)
        return MKCoordinateRegion(center: item.coordinate, span: span)
    }
    
<<<<<<< HEAD
<<<<<<< HEAD
    func currentRegion(latDelta: CLLocationDegrees, longDelta: CLLocationDegrees) -> MKCoordinateRegion {  // Uses currentRegion on page 424
        guard let item = items.first else {
            return MKCoordinateRegion()
        }

        let span = MKCoordinateSpan(latitudeDelta: latDelta, longitudeDelta: longDelta)
        return MKCoordinateRegion(center: item.coordinate, span: span)
    }
=======
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
//    func currentRegion(latDelta: CLLocationDegrees, longDelta: CLLocationDegrees) -> MKCoordinateRegion {
//        guard let item = items.first else {
//            return MKCoordinateRegion()
//        }
//
//        let span = MKCoordinateSpan(latitudeDelta: latDelta, longitudeDelta: longDelta)
//        return MKCoordinateRegion(center: item.coordinate, span: span)
//    }
<<<<<<< HEAD
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
}
