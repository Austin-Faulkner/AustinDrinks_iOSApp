//
//  MapViewController.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 1/27/22.
//

import UIKit
import MapKit

class MapViewController: UIViewController {

    @IBOutlet var mapView: MKMapView!
    
    private let manager = MapDataManager()
    
    var selectedEstablishment: EstablishmentItem?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        initialize()
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        switch segue.identifier! {
        case Segue.showDetail.rawValue: showEstablishmentDetail(segue: segue)
        default: print("Segue not added")
        }
    }
}

// MARK: Private Extension
private extension MapViewController {
    func initialize() {
        mapView.delegate = self
        manager.fetch { (annotations) in setupMap(annotations) }
    }
    
    func setupMap(_ annotations: [EstablishmentItem]) {
<<<<<<< HEAD
<<<<<<< HEAD
        mapView.setRegion(manager.currentRegion(latDelta: 0.5, longDelta: 0.5), animated: true) // .currentRegion()

//        mapView.setRegion(manager.initialRegion(latDelta: 0.5, longDelta: 0.5), animated: true) // .currentRegion()
=======
//        mapView.setRegion(manager.currentRegion(latDelta: 0.5, longDelta: 0.5), animated: true) // .currentRegion()

        mapView.setRegion(manager.initialRegion(latDelta: 0.5, longDelta: 0.5), animated: true) //   .currentRegion()
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
=======
//        mapView.setRegion(manager.currentRegion(latDelta: 0.5, longDelta: 0.5), animated: true) //  .currentRegion()

        mapView.setRegion(manager.initialRegion(latDelta: 0.5, longDelta: 0.5), animated: true) //  .currentRegion()
>>>>>>> d5fa275c63f97a2a1678d183395d3c5da05b7d6e
        mapView.addAnnotations(manager.annotations)
    }
    
    func showEstablishmentDetail(segue: UIStoryboardSegue) {
        if let viewController = segue.destination as? EstablishmentDetailTableViewController,
           let establishment = selectedEstablishment {
            viewController.selectedEstablishment = establishment
        }
    }
}

// MARK: MKMapViewDelegate
extension MapViewController: MKMapViewDelegate {
    
    func mapView(_ mapView: MKMapView, annotationView view: MKAnnotationView, calloutAccessoryControlTapped control: UIControl) {
        guard let annotation = mapView.selectedAnnotations.first else {
            return
        }
        selectedEstablishment = annotation as? EstablishmentItem
        self.performSegue(withIdentifier: Segue.showDetail.rawValue, sender: self)
    }
    
    func mapView(_ mapView: MKMapView, viewFor annotation: MKAnnotation) -> MKAnnotationView? {
        let identifier = "custompin"
        guard !annotation.isKind(of: MKUserLocation.self) else {
            return nil
        }
        
        let annotationView: MKAnnotationView
        if let customAnnotationView = mapView.dequeueReusableAnnotationView(withIdentifier: identifier) {
            annotationView = customAnnotationView
            annotationView.annotation = annotation
        } else {
            let av = MKAnnotationView(annotation: annotation, reuseIdentifier: identifier)
            av.rightCalloutAccessoryView = UIButton(type: .detailDisclosure)
            annotationView = av
        }
        annotationView.canShowCallout = true
        if let image = UIImage(named: "custom-annotation") {
            annotationView.image = image
            annotationView.centerOffset = CGPoint(x: -image.size.width / 2, y: -image.size.height / 2)
        }
        return annotationView
    }
}
