//
//  ExploreViewController.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 01/29/22.
//

import UIKit
import MapKit

class ExploreViewController: UIViewController, UICollectionViewDelegate {

    @IBOutlet weak var collectionView: UICollectionView!
    let manager = ExploreDataManager()
    var selectedCity: LocationItem?
    var headerView: ExploreHeaderView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        initialize()
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        switch segue.identifier! {
        case Segue.locationList.rawValue:
            showLocationList(segue: segue)
        case Segue.establishmentList.rawValue:
            showEstablishmentList(segue: segue)
        default:
            print("Segue not added.")
        }
    }
    
    override func shouldPerformSegue(withIdentifier identifier: String, sender: Any?) -> Bool {
        if identifier == Segue.establishmentList.rawValue,
           selectedCity == nil {
            showLocationRequiredAction()
            return false
        }
        return true
    }
}

// MARK: Private Extension
private extension ExploreViewController {
    func initialize() {
        manager.fetch()
    }
    
    func showLocationList(segue: UIStoryboardSegue) {
        guard let navController = segue.destination as? UINavigationController,
              let viewController = navController.topViewController as? LocationViewController else {
                  return
              }
        viewController.selectedCity = selectedCity
    }
    
    
    func showEstablishmentList(segue: UIStoryboardSegue) {
        if let viewController = segue.destination as? DrinkingEstablishmentsListViewController,
           let city = selectedCity,
           let index = collectionView.indexPathsForSelectedItems?.first?.row {
            viewController.selectedTags = manager.exploreItem(at: index).name
            viewController.selectedCity = city
        }
    }
    
    func showLocationRequiredAction() {
        let alertController = UIAlertController(title: "Location Needed", message: "Please select a location.", preferredStyle: .alert)
        let okAction = UIAlertAction(title: "Ok", style: .default, handler: nil)
        alertController.addAction(okAction)
        present(alertController, animated: true, completion: nil)
    }
    
    @IBAction func unwindLocationCancel(segue: UIStoryboardSegue) {
    }
    
    @IBAction func unwindLocationDone(segue: UIStoryboardSegue) {
        if let viewController = segue.source as? LocationViewController {
            selectedCity = viewController.selectedCity
            if let location = selectedCity {
                headerView.locationLabel.text = location.cityAndState
            }
        }
    }
}

// MARK: UICollectionViewDataSource
extension ExploreViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, viewForSupplementaryElementOfKind kind: String, at indexPath: IndexPath) -> UICollectionReusableView {
        let header = collectionView.dequeueReusableSupplementaryView(ofKind: kind, withReuseIdentifier: "header", for: indexPath)
        headerView = header as? ExploreHeaderView
        return headerView
    }
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        manager.numberOfExploreItems()  // Number of app panes
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "exploreCell", for: indexPath) as! ExploreCell
        let exploreItem = manager.exploreItem(at: indexPath.row)
        cell.exploreImageView.image = UIImage(named: exploreItem.image!)
        return cell
    }
}
