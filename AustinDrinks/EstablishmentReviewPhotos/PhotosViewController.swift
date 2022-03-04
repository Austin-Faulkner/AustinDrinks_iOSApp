//
//  PhotosViewController.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/5/22.
//

import UIKit

class PhotosViewController: UIViewController {

    @IBOutlet var collectionView: UICollectionView!
    var selectedEstablishmentID: Int?
    var establishmentPhotos: [EstablishmentPhotoItem] = []

    override func viewDidLoad() {
        super.viewDidLoad()
        initialize()
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated)
        checkPhotos()
    }
}

private extension PhotosViewController {
    func initialize() {
        setupCollectionView()
    }
    
    func setupCollectionView() {
        let flow = UICollectionViewFlowLayout()
        flow.sectionInset = UIEdgeInsets(top: 7, left: 7, bottom: 7, right: 7)
        flow.minimumInteritemSpacing = 0
        flow.minimumLineSpacing = 7
        flow.scrollDirection = .horizontal
        collectionView.collectionViewLayout = flow
    }
    
    func checkPhotos() {
        let viewController = self.parent as? EstablishmentDetailViewController
        if let id = viewController?.selectedEstablishment?.establishmentID {
            establishmentPhotos = CoreDataManager.shared.fetchRestPhotos(by: id)
            if establishmentPhotos.count > 0 {
                collectionView.backgroundView = nil
            } else {
                let view = NoDataView(frame: CGRect(x: 0, y: 0, width: collectionView.frame.width, height: collectionView.frame.height))
                view.set(title: "Photos", desc: "There are currently no photos", accomm: "", rating: "", count: "")
                collectionView.backgroundView = view
            }
            collectionView.reloadData()
        }
    }
}

extension PhotosViewController: UICollectionViewDataSource {
    
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        establishmentPhotos.count
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "photoCell", for: indexPath) as! PhotoCell
        let item = establishmentPhotos[indexPath.item]
        
        if let photo = item.photo { cell.set(image: photo )}
        
        return cell
    }
}

extension PhotosViewController: UICollectionViewDelegateFlowLayout {
    
    func collectionView(_ collectionView: UICollectionView, layout collectionViewLayout: UICollectionViewLayout, sizeForItemAt indexPath:IndexPath) -> CGSize {
        if establishmentPhotos.count == 1 {
            let width = collectionView.frame.size.width - 14
            return CGSize(width: width, height: 200)
        } else {
            let width = collectionView.frame.size.width - 21
            return CGSize(width: width, height: 200)
        }
    }
}
